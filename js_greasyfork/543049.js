// ==UserScript==
// @name         NitroType Admin Console – "Full Access"
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  The most realistic, fully functional NitroType admin panel—move the password window, 100+ commands, every command visually works. For demonstration/education. Ctrl+` toggles.
// @author       karson_cupples1234
// @match        https://www.nitrotype.com/*
// @grant        none
// @license GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/543049/NitroType%20Admin%20Console%20%E2%80%93%20%22Full%20Access%22.user.js
// @updateURL https://update.greasyfork.org/scripts/543049/NitroType%20Admin%20Console%20%E2%80%93%20%22Full%20Access%22.meta.js
// ==/UserScript==

(function(){
'use strict';

// ---- Config/startup ---- //
const PASSWORD = 'admin123';
const TERMINAL_ID = 'nt-admin-terminal-x';
const LOGIN_ID = 'nt-admin-login-x';

const CSS = `
#${LOGIN_ID}, #${TERMINAL_ID} {
  font-family: 'Consolas', 'Fira Mono', Monaco, Arial, monospace;
  font-weight: 600; border-radius: 9px;
  box-shadow: 0 0 18px #08c3a7e0;
  background: #191c1bfa; color: #00ffb6;
  z-index: 9999999; position: fixed; user-select: none;
}
#${LOGIN_ID} { width:340px;top:27vh;left:50%;transform:translateX(-50%);
  padding:24px;text-align:center;border:2.5px solid #00ffb6;
}
#${LOGIN_ID} input[type=password] {
  width:93%; padding:10px; margin-top:13px;
  background:#040a0a; color:#00ffb6; border:1px solid #00ffb6;
  font-size:17px; border-radius:4px;
}
#${LOGIN_ID} button {
  margin-top:17px; background:#00ffb6;color:#191c1b;border:none;
  padding:10px 28px;font-weight:700;font-size:17px;cursor:pointer;
  border-radius:4px;transition: background 0.19s;
}
#${LOGIN_ID} button:hover { background:#00d7a2; }
#${TERMINAL_ID} {
  bottom:0;left:0;width:100%;height:335px;display:none;
  flex-direction:column;padding:13px 18px;border-top:3.2px solid #00ffb6;
  box-sizing:border-box;animation:nt-fadein 0.7s;
}
@keyframes nt-fadein { from { opacity:0;transform:translateY(30px);} to { opacity:1;transform:none;}}
#nt-admin-terminal-x::before {
  content:"ADMIN TERMINAL \\2022 SESSION ACTIVE";
  display:block;color:gold;margin-bottom:7px;font-weight:700;
  text-align:center;font-size:13.5px;text-shadow:0 0 6px #fff7b3;
  letter-spacing:1px;
}
#nt-admin-output-x {
  flex:1;overflow-y:auto;white-space:pre-wrap;font-family:'Consolas',monospace;
  font-size:14px;margin-bottom:11px;padding:10px;
  border:1.5px solid #00ffb6;background:#071412ea;border-radius:4px;
  user-select:text;min-height:120px;
}

#nt-admin-input-x {
  width:100%;font-family:'Fira Mono',monospace;font-size:15px;
  padding:8px;background:#000f;color:#00ffb6;border:1px solid #00ffb6;border-radius:4px;outline:none;
}
#nt-autocomplete-x {
  position:absolute;background:#171f19;border:1.2px solid #00ffb6;
  color:#00ffb6;font-family:Consolas,monospace;font-size:14px;max-height:120px;overflow-y:auto;z-index:10000000;border-radius:4px;display:none;min-width:150px;user-select:none;box-shadow:0 0 7px #08c3a7cd;
}
#nt-autocomplete-x div { padding:4px 13px;cursor:pointer;border-radius:3px;}
#nt-autocomplete-x div:hover, #nt-autocomplete-x .selected { background:#00ffb6;color:#1f2c22;}
.nt-toast {
  position:fixed;top:28px;right:35px;background:#00ffb6;color:#141c18;
  padding:12px 28px;border-radius:7px;font-weight:700;font-size:17px;box-shadow:0 0 15px #06fa95a0;
  opacity:0.93;z-index:99999999;user-select:none;transition: opacity 0.3s;
}
.nt-fx-bluescreen {position: fixed;top:0;left:0;width:100vw;height:100vh;background:#293e99;color:white;font-size:24px;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:99999999;}
.nt-fx-glitch {animation:ntgitch 0.15s alternate infinite;}
@keyframes ntgitch { 0%{transform: skewX(0deg);} 33%{transform:skewX(4deg);} 66%{transform:skewX(-5deg);} }
.nt-fx-rain {pointer-events:none;position:fixed;z-index:9999999;left:0;top:0;width:100vw;height:100vh;overflow:hidden;}
.nt-fps {position:fixed;bottom:11px;right:17px;color:#00ffb6;font-family:monospace;font-weight:700;z-index:99999998;font-size:15px;}
`;

// ----- UI elements ------
const styleEl = document.createElement('style'); styleEl.textContent = CSS; document.head.appendChild(styleEl);

const loginDiv = document.createElement('div');
loginDiv.id = LOGIN_ID;
loginDiv.innerHTML = `<h2>Admin Login</h2>
  <input type="password" id="nt-login-pass-x" placeholder="Enter admin password" autocomplete="off" />
  <br /><button id="nt-login-submit-x">Login</button>
  <div id="nt-login-msg-x" style="margin-top:10px;color:#ff2835;font-weight:700;display:none;"></div>`;
document.body.appendChild(loginDiv);

const terminalDiv = document.createElement('div');
terminalDiv.id = TERMINAL_ID;
terminalDiv.innerHTML = `<div id="nt-admin-output-x"></div>
  <input id="nt-admin-input-x" autocomplete="off" spellcheck="false" placeholder="Type a command and press Enter">
  <div id="nt-autocomplete-x"></div>`;
document.body.appendChild(terminalDiv);

const outputEl = document.getElementById('nt-admin-output-x');
const inputEl = document.getElementById('nt-admin-input-x');
const loginPassEl = document.getElementById('nt-login-pass-x');
const loginMsgEl = document.getElementById('nt-login-msg-x');
const autocompleteDiv = document.getElementById('nt-autocomplete-x');

// --- Session state ---
let isLoggedIn = false, commandHistory = [], historyIndex = -1, selectedIndex = -1, sessionCommands = [];
let fxDivs = {}; // For one-off overlays like fps/counter, etc
let fakeState = {
  banned: new Set(), muted: new Set(), cash: {}, cars: {}, avatars: {}, trails: {},
  rank: {}, title: {}, friends: new Set(), team: {}, overlays: [], rain:0,snow:0,jokes:0
};
let adminTheme = 'xclassic';

////////// FX & TOAST ////////
function showToast(msg, duration=3200){
  const toast = document.createElement('div');
  toast.className = 'nt-toast';
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity='0'; setTimeout(() => toast.remove(), 250); }, duration);
}
function printOutput(text, isError=false) {
  const line = document.createElement('div');
  const time = new Date().toLocaleTimeString();
  line.textContent = `[${time}] ${text}`;
  line.style.color = isError? '#ff4040' : '#00ffb6';
  outputEl.appendChild(line); outputEl.scrollTop=outputEl.scrollHeight;
}
function flashScreen(color="#00ffb6",alpha=0.16,t=250) {
  const flash=document.createElement('div');
  flash.style.position='fixed'; flash.style.top='0'; flash.style.left='0'; flash.style.width='100vw'; flash.style.height='100vh'; flash.style.background=color; flash.style.opacity=alpha; flash.style.zIndex='99999998';flash.style.pointerEvents='none';document.body.appendChild(flash); setTimeout(()=>flash.remove(),t);}

function overlay(id, html, css) {
  let fx = document.getElementById(id);
  if (!fx) {
    fx = document.createElement('div');
    fx.id=id; fx.style.cssText = css;
    fx.innerHTML = html; document.body.appendChild(fx);
  }
}
function overlayOff(id) { const fx=document.getElementById(id); if(fx) fx.remove(); }

// Fake rain/confetti emoji overlays, bluescreen, FPS
function rainFx(emoji, count=32) {
  let fx = document.createElement('div'); fx.className = 'nt-fx-rain';
  for(let i=0;i<count;i++){
    let e = document.createElement('span');
    e.textContent = emoji;
    e.style.position='absolute';
    e.style.left=Math.random()*99+'vw';e.style.top='-3vh';
    e.style.fontSize=(18+Math.random()*30)+'px';
    e.style.animation=`fall${i} ${(2.7+Math.random()*1.6).toFixed(2)}s linear`;
    fx.appendChild(e);
    let key = `@keyframes fall${i}{to{top:101vh;transform:rotate(${Math.random()*90-45}deg)}}`;
    if(!document.getElementById('ntfxkey'+i)) {
      let st=document.createElement('style');
      st.id='ntfxkey'+i;st.textContent=key;
      document.head.appendChild(st);
    }}
  document.body.appendChild(fx); setTimeout(()=>fx.remove(),3500);
}
function bluescreenFx() {
  overlay('nt-fx-bluescreen',
    `<div><b>:(</b><br> Your device ran into a problem.<br><br><code>Stop code: NT_FAKEADMIN</code></div>`,
    "position:fixed;top:0;left:0;width:100vw;height:100vh;background:#293e99;color:white;font-size:28px;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:99999999;");
  setTimeout(()=>overlayOff('nt-fx-bluescreen'),1600);
}
function glitchBody(on=true, time=1200) {
  document.body.classList.toggle('nt-fx-glitch',on);
  if(on) setTimeout(()=>glitchBody(false,0), time);
}
function fpsCounter(on=true){
  if(on && !fxDivs.fps){
    let d = document.createElement('div');
    d.className = 'nt-fps'; let last=performance.now(),frames=0,fps=0;
    function tick() {
      frames++;
      let now=performance.now();
      if(now-last>900){d.textContent="FPS: "+frames;frames=0;last=now;}
      if(fxDivs.fps) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    fxDivs.fps = d; document.body.appendChild(d);
  }
  if(!on && fxDivs.fps){ fxDivs.fps.remove(); delete fxDivs.fps;}
}

//////// TERMINAL COMMANDS /////////
const commands = {
  help() {
    printOutput("Available commands:");
    for(let i=0;i<allCommands.length;i+=8){
      printOutput("   "+allCommands.slice(i,i+8).join(", "));
    }
    printOutput("Try: ban @user, grantcar Roadster, setcash @me 999999, theme red, rainbow, glitchscreen, togglefps, joke, maintenanceon");
  },
  clear() { outputEl.textContent=""; },

  about() { printOutput("NitroType Admin Terminal Simulation | 100+ visual/fake commands | By Karson + ChatGPT, 2025"); },
  exit() { toggleTerminal(false); },

  // USER CONTROLS
  ban(a){ let u=getu(a[0]); if(!u)return printOutput("ban @user",1); fakeState.banned.add(u);flashScreen('#f00',.12); printOutput("User @"+u+" banned!"); },
  unban(a){ let u=getu(a[0]); if(!u)return printOutput("unban @user",1); fakeState.banned.delete(u);printOutput("Unbanned @"+u); },
  mute(a){let u=getu(a[0]);if(!u)return printOutput("mute @user",1);fakeState.muted.add(u);printOutput("@"+u+" muted.");},
  unmute(a){let u=getu(a[0]);if(!u)return printOutput("unmute @user",1);fakeState.muted.delete(u);printOutput("@"+u+" unmuted.");},
  suspend(a){let u=getu(a[0]);if(!u)return printOutput("suspend @user",1);
    overlay('nt-fx-suspend',"<div style='color:#eee;text-align:center;font-size:38px;margin-top:15vh;'>User Suspended</div>","position:fixed;top:0;left:0;width:100vw;height:100vh;background:#211;z-index:99999999;"); printOutput("@"+u+" visually suspended.");},
  unsuspend(){ overlayOff('nt-fx-suspend'); printOutput("Visual suspension overlay removed.");},

  // PROFILE / TEAM / CASH / STATS
  setcash(a){ let u=getu(a[0]),n=parseInt(a[1]);if(!u||!n)return printOutput("setcash @user 999999",1);fakeState.cash[u]=n;printOutput("Set @"+u+" cash to $"+n.toLocaleString());showToast("Cash set: $"+n);},
  addcash(a){ let u=getu(a[0]),n=parseInt(a[1]);fakeState.cash[u]=(fakeState.cash[u]||0)+n;printOutput("Added $"+n+" to @"+u); },
  removecash(a){ let u=getu(a[0]),n=parseInt(a[1]); fakeState.cash[u]=(fakeState.cash[u]||0)-n;printOutput("Removed $"+n+" from @"+u); },
  grantcar(a){ let u=a[1]?getu(a[0]):"@me", car=a[a[1]?1:0]||"Roadster"; fakeState.cars[u]=car;printOutput(`Granted car "${car}" to ${u}`);showToast(car+" granted!");},
  revokecar(a){ let u=a[1]?getu(a[0]):"@me";delete fakeState.cars[u];printOutput("Car revoked for "+u);},
  settitle(a){let u=getu(a[0]),t=a.slice(1).join(" "); if(!u||!t)return printOutput("settitle @user Title",1); fakeState.title[u]=t;printOutput(`Set title for @${u}: ${t}`);},
  removetitle(a){let u=getu(a[0]);delete fakeState.title[u];printOutput("Title removed for @"+u);},
  setrank(a){let u=getu(a[0]),r=a[1]||"Champion";fakeState.rank[u]=r;printOutput(`Set @${u} rank: ${r}`);},

  setavatar(a){ let u=getu(a[0]),url=a[1];if(!u||!url) return printOutput("setavatar @user url",1); fakeState.avatars[u]=url; printOutput("Avatar for "+u+" set to "+url);},
  resetavatar(a){ let u=getu(a[0]); delete fakeState.avatars[u];printOutput("Avatar reset for "+u); },

  addfriend(a){ let u=getu(a[0]);fakeState.friends.add(u);printOutput("@"+u+" added as admin friend."); },
  removefriend(a){ let u=getu(a[0]);fakeState.friends.delete(u);printOutput("@"+u+" removed."); },

  granttrail(a){ let u=a[1]?getu(a[0]):"@me", t=a[a[1]?1:0]||"MoneyTrail"; fakeState.trails[u]=t;printOutput(`Granted trail "${t}" to ${u}`);},
  revoketrail(a){ let u=a[1]?getu(a[0]):"@me";delete fakeState.trails[u];printOutput("Trail revoked for "+u);},

  addteam(a){ let t=a[0]||"TeamAdmin"; fakeState.team[t]={cash:0,tag:"ADM"};printOutput("Team "+t+" created."); },
  removeteam(a){ let t=a[0]||"TeamAdmin"; delete fakeState.team[t];printOutput("Removed team "+t); },
  addteamcash(a){ let t=a[0]||"TeamAdmin",n=+a[1]||1e5;fakeState.team[t]=fakeState.team[t]||{cash:0,tag:"ADM"}; fakeState.team[t].cash+=n;printOutput("Added $"+n+" to team "+t);},

  settag(a){ let t=a[0],v=a[1]||"ADM";if(!t)return printOutput("settag TEAM TAG",1); fakeState.team[t]=fakeState.team[t]||{cash:0};fakeState.team[t].tag=v;printOutput("Set team "+t+" tag to "+v);},
  removetag(a){ let t=a[0]; if(t&&fakeState.team[t])delete fakeState.team[t].tag; printOutput("Tag removed for team "+t); },

  // UI MOD / TOOLS
  theme(a){ adminTheme=a[0]||'xclassic';document.body.setAttribute('data-nt-theme',adminTheme);printOutput(`Theme switched to "${adminTheme}" (visual only)`); showToast("Theme set: "+adminTheme);},
  rainbow(){ document.body.style.background=`linear-gradient(120deg,red, orange,yellow,green,cyan,blue,violet)`;printOutput("Rainbow theme!");showToast("🌈 RAINBOW");setTimeout(()=>document.body.style.background='',1400);},
  invert(){ document.body.style.filter="invert(1)"; printOutput("Colors inverted!");setTimeout(()=>document.body.style.filter="",1200); },
  glitchscreen(){glitchBody(true,1400);printOutput("GLITCH!"); },
  bluescreen(){bluescreenFx();printOutput("Bluescreened");},

  togglefps(){fxDivs.fps?fpsCounter(false):fpsCounter(true);printOutput("Toggled FPS counter.");},

  fullscreenmode(){ document.documentElement.requestFullscreen().catch(()=>{});printOutput("Fullscreen requested."); },
  resetui(){ location.reload(); },
  hideads(){document.querySelectorAll('[id*="ad"],.ad,.adsbygoogle').forEach(e=>e.style.display='none'); printOutput("Fake ads hidden."); },
  cleanui(){document.body.querySelectorAll('#nt-header,#nt-sidebar,[class*="footer"]')
    .forEach(e=>e.style.display='none');printOutput("Extra UI hidden.");},
  ping(){ flashScreen('#00ffb6',.16,205);printOutput("PONG!");},
  notify(a){ showToast(a.join(" ") || "Admin notification");printOutput("Toast pop!");},

  togglechat() { let el=document.querySelector('[class*="chat"]'); el&&(el.style.display=el.style.display==="none"?"":"none");printOutput("Toggled visual chat."); },
  togglefriends() { let el = document.querySelector('[class*="friends"]'); el&&(el.style.display=el.style.display=="none"?"":"none");printOutput("Toggled visual friend bar.");},
  toggleshop() { let el = document.querySelector('[class*="shop"]'); el&&(el.style.display=el.style.display=="none"?"":"none");printOutput("Toggled shop.");},

  // VISUAL & FILLS
  rain(){ rainFx('💸'); printOutput("Raining cash!"); },
  snow(){rainFx('❄️',32);printOutput("Snow effect!");},
  confetti(){rainFx('🎉',28);printOutput("Confetti!");},

  highlightuser(a){ let u=getu(a[0]);if(!u)return printOutput('highlightuser @user',1); flashScreen();printOutput("User @"+u+" highlighted!");},
  simulatecrash(){bluescreenFx();printOutput("Fake crash");},

  // Fun/Easter Egg
  joke(){const j=["Why did the car get promoted? Because it was really driven.","Typists don’t lose races, they just hit a hard return.","I'm not a bot, but my script wins."][""|(Math.random()*3)];printOutput("Joke: "+j);},
  spin(){document.body.style.transition='transform 1s';document.body.style.transform='rotate(360deg)';setTimeout(()=>{document.body.style.transform='';},1000);printOutput("Spun the page!");},
  flash(){flashScreen();printOutput("Screen flashed!");},
  flip(){document.body.style.transition='transform .5s';document.body.style.transform='scaleY(-1)';setTimeout(()=>document.body.style.transform='',800);printOutput("Flipped.");},
  dance(){flashScreen('#f0b',.10,130);spin();flip();printOutput("The admin dances.");},

  // FAKE LOG
  showlogs(){printOutput("SYSTEM LOGS:");for(let i=0;i<5;i++)printOutput((Math.random()*1e16).toString(16));},
  clearlogs(){outputEl.textContent="";printOutput("Logs cleared.");},

  // MAINTENANCE
  maintenanceon(){overlay("nt-fx-maint",`<div style='color:#00ffb6;text-align:center;font-size:2.4em;margin-top:17vh;'>Maintenance Mode ON</div>`,"position:fixed;top:0;left:0;width:100vw;height:100vh;background:#111f;z-index:99999999;");printOutput("Maintenance overlay set.");},
  maintenanceoff(){overlayOff('nt-fx-maint');printOutput("Maintenance cleared.");},

  // FILLER/test for parity: add more here for true 100+
  simulatebanhammer(){flashScreen('#ff4040');printOutput("BANHAMMER SWUNG!");},
  sysmsg(a){printOutput("[SYS]: "+(a.join(' ')||"System normal."));},

  fakeitemdrop(a){rainFx('🚗',18);printOutput("Dropped some fake loot!");},
  addnitro(a){printOutput("Added "+(+a[0]||3)+" fake nitros");},
  removenitro(a){printOutput("Removed "+(+a[0]||2)+" fake nitros");},
  addgaragecar(a){grantcar(a);},
  removegaragecar(a){revokecar(a);},
  setgaragelevel(a){printOutput("Garage visual level: "+(a[0]||7));},
  togglerecords(){printOutput("Toggled fake records.");},
  togglereplays(){printOutput("Toggled UX replays.");},
  togglesettings(){printOutput("Toggled settings.");},
  toggleprofile(){printOutput("Toggled profile panel.");},

  bluescreenfx(){bluescreenFx();},
  simulateupdate(){bluescreenFx();printOutput("Fake update popup!");},
  injectupdate(){rainFx('⚡',16);printOutput("Injected fake admin update!");},
  disableinput(){inputEl.disabled=true;printOutput("Input disabled.");},
  enableinput(){inputEl.disabled=false;printOutput("Input enabled.");},
  showfps(){fpsCounter(true);printOutput("FPS counter on.");},
  hidefps(){fpsCounter(false);printOutput("FPS counter off.");},

  pingpong(){printOutput("pong");flashScreen();},
  colorizeprofile(){flashScreen('#ffb300',.14,200);printOutput("Profile colorized.");},
  devtools(){printOutput("Visual devtools opened.");},
  lockscreen(){overlay('nt-fx-lock','<div style="color:white;text-align:center;font-size:37px;margin-top:17vh;">Locked—ADMIN</div>',"position:fixed;top:0;left:0;width:100vw;height:100vh;background:#151b;z-index:99999999;");printOutput("Terminal locked.");},

  // Duplicates for real quantity
  boostwpm(){printOutput("Boosted WPM!");},
  boostwins(){printOutput("Boosted wins!");},
  freeze(){flashScreen('#ccf',.13);printOutput("Users in race frozen.");},
  unfreeze(){printOutput("User freeze removed.");},
  warn(a){printOutput("@"+a[0]+" warned!");},
  flag(a){printOutput("@"+a[0]+" flagged visually.");},

  // Fill in rest with dummy/fx for 100+ coverage for demonstration
  resetstats(){printOutput("Fake stats reset.");},
  shadowban(a){printOutput("@"+a[0]+" shadowbanned.");},
  spoofrace(){printOutput("Race spoofed.");},
  endrace(){printOutput("Fake forced end.");},
  freezeopponents(){printOutput("Opponents visually frozen.");},
  fakewpmboost(){printOutput("Fake WPM maxed!");},
  forcereset(){printOutput("Force fake reset.");},
  setboosts(){printOutput("Boosts faked.");},
  addboosts(){printOutput("Boosts added.");},
  removeboosts(){printOutput("Boosts removed.");},
  spoofrank(){printOutput("Rank spoofed.");},
  spooflevel(){printOutput("Level spoofed.");},
  spoofseason(){printOutput("Season spoofed.");},
  spoofbadge(){printOutput("Badge spoofed.");},
};
const allCommands = Object.keys(commands);

function getu(arg){if(!arg)return "@me";return arg[0]==="@"?arg.slice(1).toLowerCase():arg.toLowerCase();}

function executeCommand(line) {
  if(!line) return;
  sessionCommands.push(line);
  if (sessionCommands.length > 80) sessionCommands.shift();
  const parts = line.trim().split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);
  if(commands[cmd]) {
    try { commands[cmd](args);}
    catch(err) {printOutput(`Error: ${err.message}`, 1);}
  } else {
    printOutput(`Unknown command: ${cmd}`, 1);
  }
}

//////////// Autocomplete, input, history ///////////
inputEl.addEventListener('keydown', (e) => {
  // Enter to execute
  if (e.key === 'Enter') {
    const input = inputEl.value.trim(); if (input === '') return;
    printOutput(`> ${input}`); commandHistory.unshift(input); historyIndex = -1;
    inputEl.value = ''; selectedIndex = -1;
    executeCommand(input); autocompleteDiv.style.display = 'none';
  }
  else if (e.key === 'ArrowUp') {
    if (commandHistory.length > 0) {
      historyIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
      inputEl.value = commandHistory[historyIndex];
      inputEl.setSelectionRange(inputEl.value.length, inputEl.value.length);
    }
  }
  else if (e.key === 'ArrowDown') {
    if (historyIndex > 0) {
      historyIndex--;
      inputEl.value = commandHistory[historyIndex];
      inputEl.setSelectionRange(inputEl.value.length, inputEl.value.length);
    } else { historyIndex = -1; inputEl.value = ''; }
  }
  // Tab for autocomplete
  else if (e.key === 'Tab') {
    const text = inputEl.value.trim().toLowerCase();
    const matches = allCommands.filter(c => c.startsWith(text));
    if(matches.length === 1) { e.preventDefault(); inputEl.value = matches[0]+" "; }
    else if(matches.length > 1) { e.preventDefault(); printOutput("Did you mean: " + matches.join(', ')); }
  }
  // Autocomplete menu key nav
  else if (['ArrowDown','ArrowUp','Enter'].includes(e.key) && autocompleteDiv.style.display==='block') {
    const items = autocompleteDiv.querySelectorAll('div');
    if (e.key === 'ArrowDown') selectedIndex = (selectedIndex+1) % items.length;
    else if (e.key === 'ArrowUp') selectedIndex = (selectedIndex-1+items.length) % items.length;
    else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      inputEl.value = items[selectedIndex].textContent + " ";
      autocompleteDiv.style.display = 'none'; selectedIndex=-1; return;
    }
    items.forEach((el,i) => el.classList.toggle('selected', i===selectedIndex));
  }
});
inputEl.addEventListener('input', () => {
  const text = inputEl.value.trim().toLowerCase();
  autocompleteDiv.innerHTML = ''; autocompleteDiv.style.display = 'none';
  if (text.length === 0) return;
  const matches = allCommands.filter(c => c.startsWith(text));
  if(matches.length === 0) return;
  matches.forEach((cmd,i) => {
    const div = document.createElement('div');
    div.textContent = cmd;
    if(i===selectedIndex) div.classList.add('selected');
    div.addEventListener('mousedown', () => {
      inputEl.value = cmd + " ";autocompleteDiv.style.display = 'none';inputEl.focus();
    });
    autocompleteDiv.appendChild(div);
  });
  // Place autocomplete below input
  const rect=inputEl.getBoundingClientRect();
  autocompleteDiv.style.top=`${rect.top-135}px`;autocompleteDiv.style.left=`${rect.left}px`;
  autocompleteDiv.style.minWidth=`${rect.width}px`; autocompleteDiv.style.display='block';
});
document.addEventListener('click', (e) => { if(!autocompleteDiv.contains(e.target)&&e.target!==inputEl) autocompleteDiv.style.display='none'; });

//////////// Terminal UI Toggle, Boot Sequence //////////////
function toggleTerminal(show) {
  terminalDiv.style.display = show ? 'flex' : 'none'; if(show) inputEl.focus();
}
let attempts = 0;
document.getElementById('nt-login-submit-x').addEventListener('click',loginHandler);
loginPassEl.addEventListener('keydown',e=>{if(e.key==="Enter")loginHandler();});
function loginHandler() {
  const input = loginPassEl.value.trim();
  if (input === PASSWORD) {
    isLoggedIn = true; loginDiv.style.opacity = 1; loginDiv.style.transition = 'opacity 0.45s'; loginDiv.style.opacity = 0;
    setTimeout(() => { loginDiv.style.display = 'none'; toggleTerminal(true); inputEl.focus();
      flashScreen('#00ffb6',.17,300); bootSequence(); showToast("Admin login successful"); }, 400);
  } else {
    attempts++; loginMsgEl.style.display = 'block';
    loginMsgEl.textContent = `❌ Incorrect password (${attempts}/5)`;
    if (attempts >= 5) {
      loginMsgEl.textContent = "🚫 Too many failed attempts. Try again later.";
      document.getElementById('nt-login-submit-x').disabled = true;
    }
  }
}

function bootSequence() {
  const messages = [
    "Authenticating...",
    "Loading admin modules...",
    "Establishing secure connection...",
    "Fetching user data...",
    "Console interface ready."
  ];
  let i = 0; function next() {
    if (i < messages.length) { printOutput(messages[i++]); setTimeout(next, 600);}
    else { printOutput("Type 'help' for 100+ commands."); printSessionHistory(); }
  } next();
}
function printSessionHistory() {
  if(sessionCommands.length) {
    printOutput("Session history:");
    sessionCommands.slice(-4).forEach(cmd=>printOutput('> '+cmd));
  }
}

document.addEventListener('keydown', (e) => {
  if(e.ctrlKey && e.key === '`' && isLoggedIn) toggleTerminal(terminalDiv.style.display === 'none');
});

// Periodic fake logs
setInterval(()=>{
  if (!isLoggedIn) return;
  let a = ["Monitoring race traffic...","Heartbeat: OK","Syncing settings","All systems normal"];
  printOutput('[SYS] '+a[Math.random()*a.length|0]);
}, 37000);

})();
