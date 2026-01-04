// ==UserScript==
// @name         [Updated] Hordes click Loot NO BAN
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  click Loot + Anti Afk + Item Uniting (Made By 0vC4, Updated By Me )
// @author       Me
// @match        https://hordes.io/play
// @icon         https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://hordes.io&size=32
// @grant        none
// @namespace    https://greasyfork.org/users/857980
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/439552/%5BUpdated%5D%20Hordes%20click%20Loot%20NO%20BAN.user.js
// @updateURL https://update.greasyfork.org/scripts/439552/%5BUpdated%5D%20Hordes%20click%20Loot%20NO%20BAN.meta.js
// ==/UserScript==


// My Discord Tag : Me
// Feel Free To Contact Me If Your Interested In More Stuff Like This !


document.write();


fetch('https://hordes.io/play')
.then(d=>d.text())
.then(async html => {
   const element = html.match(/<script.*?client\.js.*?><\/script>/)[0]
   const url = element.match(/src="(.*?)"/)[1]
   html = html.replace(element,`<script>let _t=origin;delete origin;eval(_t)</script>`)

   let origin = await (fetch(url).then(d=>d.text()))

   const name = 'ha';
   const pickedMarker = 'inProcessPick';

   const vr = {
      intersReady: {
         antiAfk: false,
         looting: true,
         uiextra: true,
      },

      antiAfk: () => (vr.intersReady.antiAfk=!vr.intersReady.antiAfk),
      looting: () => (vr.intersReady.looting=!vr.intersReady.looting),
      uiextra: () => (vr.intersReady.uiextra=!vr.intersReady.uiextra),

      rules: { // edit your rules here, or you can do it in console "ha.loot2 = false"
         gold: true,
         rune: true,
         misc: false,

         book1: false,
         book2: false,
         book3: false,
         book4: false,
         book5: true,

         loot1: false,
         loot2: false,
         loot3: false,
         loot4: true,
         quality: 69
      },

      command (name, str) { vr.send(vr.coder.clientCommand.packData({command: name, string: str+''})) },
      drop (slotID) {vr.command("itemdrop", slotID); },
      pick (item) {if(item[pickedMarker])return; item[pickedMarker]=true; vr.send(vr.coder.clientPlayerChangeTarget.encode({_header:1,target:item.id}))},
      invFull () {
         if (!(vr.me && vr.me.inventory && vr.me.inventory.slots)) return true;
         return [...vr.me.inventory.slots.keys()].filter(i=>i<101).length === vr.me.inventory.size;
      },
      concatItems () {
         if (!(vr.me && vr.me.inventory && vr.me.inventory.slots)) return;

         const inventoryItems = [...vr.me.inventory.slots].filter(a=>a[0]<101);
         const stackable = (item, item2) => item.type==item2.type&&item.tier==item2.tier&&item.stacks>0&&item.stacks<50;

         inventoryItems.map(item => {
            const withItem = inventoryItems.find(item2 => item[0] > item2[0] && stackable(item[1], item2[1]) )
            if (withItem) vr.command('itemmove', item[0]+' '+withItem[0])
         });
      },


      inters: {
         antiAfk: setInterval(() => vr.intersReady.antiAfk&&vr.world&&vr.world.tick(Math.random()/1e3), 1e3/60),
         uiextra: setInterval(() => {
            if (!vr.intersReady.uiextra) return;

            if (getChoiceByTitle('Yes, show me the items for sale.')) getChoiceByTitle('Yes, show me the items for sale.').click()
            if (getChoiceByTitle('Yes, open my Stash.')) getChoiceByTitle('Yes, open my Stash.').click()
            if (getChoiceByTitle('Show me your wares.')) getChoiceByTitle('Show me your wares.').click()
            if (getChoiceByTitle('Yes, I have some items.')) getChoiceByTitle('Yes, I have some items.').click()
         }),
         looting: setInterval(() => {
            if (!vr.intersReady.looting) return;

            if (!vr.me) return;
            if (!vr.world.entities.type[3].length) return;

            const full = vr.invFull();


            const inventoryItems = [...vr.me.inventory.slots].filter(a=>a[0]<101).map(a=>a[1]);
            const stackable = item => inventoryItems.find(i=>i.type==item.droptype&&i.tier==item.tier&&i.stacks>0&&i.stacks<50)

            const loot = vr.world.entities.type[3]
            .map(i=>((i[pickedMarker]=false),i))
            .filter(i => {
               if (i.droptype == 'gold') return vr.me.stats.alive && vr.rules.gold;
               if (stackable(i)) return true;
               if (full) return false;

               if (i.droptype == 'book') {
                  return   vr.rules.book1 && i.name.endsWith('Lv. 1 low') ||
                           vr.rules.book2 && i.name.endsWith('Lv. 2 low') ||
                           vr.rules.book3 && i.name.endsWith('Lv. 3 low') ||
                           vr.rules.book4 && i.name.endsWith('Lv. 4 good') ||
                           vr.rules.book5 && i.name.endsWith('Lv. 5 good')
                  } else if (i.droptype == 'misc') {
                     return vr.rules.misc;
                  } else if (i.droptype == 'rune') {
                     return vr.rules.rune;
                  } else {
                     return   (vr.rules.loot1 && i.color == 'common' ||
                              vr.rules.loot2 && i.color == 'uncommon' ||
                              vr.rules.loot3 && i.color == 'rare' ||
                              vr.rules.loot4 && i.color == 'epic') &&
                         		vr.rules.quality <= i.quality
                  }
                  return false;
            })
            .filter(i => i.canBePickedUpBy(vr.me))
            .map(vr.pick);

         }),
      }
   };

   window[name] = vr;

   let world = "vn"
   let coder = "fa"
   let ws = "Um"
   let send = "Am"

    origin = origin.replace('this.player=t', 'Object.assign(window.'+name+
      ',{world:'+world+
      ',me:t'+
      ',coder:'+coder+
      ',ws:'+ws+
      ',send:'+send+
      '}),this.player=t')

    window.origin = origin
    document.open().write(html)
    document.close()


    const getChoiceByTitle = title => [...document.getElementsByClassName('choice')].find(c=>c.textContent.includes(title))


    // hotkeys
    document.addEventListener('keydown', e => e.code == 'ShiftRight' && vr.looting());
    document.addEventListener('keydown', e => e.code == 'ControlRight' && vr.concatItems());


    let clickLootUI = false;
    document.addEventListener('keydown', e => e.shiftKey && e.code == 'KeyL' && toggleclickLootSettings());

    function toggleclickLootSettings() {
      if (!clickLootUI) {
         document.querySelector(".l-ui.layout > .container:first-child").insertAdjacentHTML('afterend',
            `<div class="absCentered container svelte-1rc4ub7 click-loot-ui">
               <style>
                  .grid-content {
                     display: grid;
                     grid-template-columns: 2fr 1fr;
                     grid-gap: 8px;
                     align-items: center;
                  }

                  .click-loot-ui .window {
                     height: 450px;
                  }
               </style>
               <div class="window panel-black svelte-1rw636">
                  <div class="titleframe svelte-1rw636">
                     <img src="/assets/ui/icons/bag.svg?v=5305285" class="titleicon svgicon svelte-1rw636">
                     <div class="textprimary title svelte-1rw636">
                        <div name="title">{Setting}</div>
                     </div>
                     <img src="/assets/ui/icons/cross.svg?v=5284585" class="btn black svgicon close-ui">
                  </div>
                  <div class="slot scrollbar svelte-1rw636">
                     <div class="menu panel-black svelte-ntyx09">
                        <h3 class="textprimary"></h3>
                        <div class="grid-content scripts">
                           <div>AUTO LOOTING ON/OFF</div>
                           <div class="btn checkbox" name="looting"></div>
                           <div>Anti AFK</div>
                           <div class="btn checkbox" name="antiAfk"></div>
                           <div>Concatenate Inventory Items</div>
                           <div class="">ControlRight</div>
                        </div>
                        <h3 class="Coins-</h3>
                        <div class="grid-content coins-meter">
                           <div>Session Time</div>
                           <div class="coins-meter-time"></div>
                           <div>Coins Earned</div>
                           <div class="coins-meter-earned"></div>
                           <div>Coins / Minute</div>
                           <div class="coins-meter-earned-minute"></div>
                           <div>Coins / Hour</div>
                           <div class="coins-meter-earned-hour"></div>
                           <div></div>
                           <div class="btn grey coins-meter-reset">Reset</div>
                        </div>
                        <h3 class="textprimary">Main</h3>
                        <div class="grid-content main">
                           <div>Gold</div>
                           <div class="btn checkbox" name="gold"></div>
                           <div>Rune</div>
                           <div class="btn checkbox" name="rune"></div>
                           <div>Misc</div>
                           <div class="btn checkbox" name="misc"></div>
                        </div>
                        <h3 class="textprimary">Books</h3>
                        <div class="grid-content books">
                           <div>Lv. 1</div>
                           <div class="btn checkbox" name="book1"></div>
                           <div>Lv. 2</div>
                           <div class="btn checkbox" name="book2"></div>
                           <div>Lv. 3</div>
                           <div class="btn checkbox" name="book3"></div>
                           <div>Lv. 4</div>
                           <div class="btn checkbox" name="book4"></div>
                           <div>Lv. 5</div>
                           <div class="btn checkbox" name="book5"></div>
                        </div>
                        <h3 class="textprimary">Items</h3>
                        <div class="grid-content items">
                           <div class="textgrey">Common (0% - 49%)</div>
                           <div class="btn checkbox" name="loot1"></div>
                           <div class="textgreen">Uncommon (50% - 69%)</div>
                           <div class="btn checkbox" name="loot2"></div>
                           <div class="textblue">Rare (70% - 89%)</div>
                           <div class="btn checkbox" name="loot3"></div>
                           <div class="textpurp">Epic (90% - 100%)</div>
                           <div class="btn checkbox" name="loot4"></div>
                           <div>Item Quality% Minimum Drop<br><small class="textgrey quality-range-indicator">%</small></div>
                           <input type="range" class="quality-range" name="quality" min="0" max="100">
                        </div>
                        <h3 class="textprimary"></h3>
                     </div>
                  </div>
               </div>
            </div>`)
         document.querySelector('.close-ui').addEventListener('click', e => toggleclickLootSettings());
         document.querySelectorAll('.click-loot-ui .scripts .btn.checkbox').forEach((el) => {
            if (vr.intersReady[el.getAttribute("name")]) el.classList.add("active")
            el.addEventListener('click', e => {
               e.target.classList.contains("active") ? e.target.classList.remove("active") : e.target.classList.add("active");
               vr.intersReady[e.target.getAttribute("name")] ^= 1;
            })
         })
         document.querySelectorAll('.click-loot-ui .main .btn.checkbox, .click-loot-ui .books .btn.checkbox, .click-loot-ui .items .btn.checkbox').forEach((el) => {
            if (vr.rules[el.getAttribute("name")]) el.classList.add("active")
            el.addEventListener('click', e => {
               e.target.classList.contains("active") ? e.target.classList.remove("active") : e.target.classList.add("active");
               vr.rules[e.target.getAttribute("name")] ^= 1;
            })
         });

         document.querySelector('.click-loot-ui .items .quality-range').value = vr.rules.quality;
         document.querySelector('.click-loot-ui .items .quality-range-indicator').innerHTML = vr.rules.quality + "%";
         document.querySelector('.click-loot-ui .items .quality-range').addEventListener('input', e => {
          	vr.rules.quality = e.target.value;
          	document.querySelector('.click-loot-ui .items .quality-range-indicator').innerHTML = e.target.value + "%";
         });

         document.querySelector('.coins-meter-reset').addEventListener('click', e => resetCoinsMeter());
      }
      else {
         document.querySelector('.click-loot-ui').remove();
      }

      clickLootUI ^= 1;
   }



   // Gold Meter
   const pad = value => value < 10 ? `0${value}` : value;

   function msToString(ms) {
      const hours = pad(Math.floor(ms / (1000 * 60 * 60) % 60));
      const minutes = pad(Math.floor(ms / (1000 * 60) % 60));
      const seconds = pad(Math.floor(ms / 1000 % 60));
      return `${hours}:${minutes}:${seconds}`;
   }

   function formatStringCoins(coins) {
      const gold = Math.floor(coins / 10000)
      const silver = pad(Math.floor((coins % 10000) / 100))
      const copper = pad(Math.floor((coins % 10000) % 100))
      return `<span>
      <span class="textgold">${gold}</span> <img class="texticon" src="/assets/ui/currency/gold.webp">
      <span class="textsilver">${silver}</span> <img class="texticon" src="/assets/ui/currency/silver.webp">
      <span class="textcopper">${copper}</span> <img class="texticon" src="/assets/ui/currency/copper.webp">
      </span>`;
   }

   let startTime = new Date().getTime();

   let currentCoins = 0;
   let coinsEarned = 0;

   function resetCoinsMeter() {
      startTime = new Date().getTime();
      currentCoins = vr.me.inventory.gold;
      coinsEarned = 0;
   }

   setInterval(() => {
      if (!vr.me) return;

      coinsEarned += Math.max(vr.me.inventory.gold - currentCoins, 0);
      currentCoins = vr.me.inventory.gold;
   })

   setInterval(() => {
      if (!clickLootUI) return;

      let midTime = new Date().getTime() - startTime;

      document.querySelector('.coins-meter-time').innerHTML = msToString(midTime);
      document.querySelector('.coins-meter-earned').innerHTML = formatStringCoins(coinsEarned);
      document.querySelector('.coins-meter-earned-minute').innerHTML = formatStringCoins(coinsEarned * 60 / (midTime / 1000));
      document.querySelector('.coins-meter-earned-hour').innerHTML = formatStringCoins(coinsEarned * 60 * 60 / (midTime / 1000));
   })
});