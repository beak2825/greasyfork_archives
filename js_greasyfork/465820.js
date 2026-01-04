// ==UserScript==
// @name          Twitch AutoPokecatch Mobile
// @description   AutoCatch™ | AutoBuy™ | Ball Recommendation™ | Timed Chat Spammer™
// @version       1.00
// @match         *://*.twitch.tv/*
// @require	      https://greasyfork.org/scripts/419717-tmi/code/TMI.js
// @run-at        document-idle
// @namespace     https://github.com/env0j
// @author        envoj
// @grant         none
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/465820/Twitch%20AutoPokecatch%20Mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/465820/Twitch%20AutoPokecatch%20Mobile.meta.js
// ==/UserScript==
/* jshint esversion: 8 */
//MOBILE VERSION
(function () {
  //SETTINGS
  let username = 'envoj';
  let oauthtoken = 'oauth:gvappm7p758js0kl43pc3qbu45bzwt';
  let random_chatter = true;
  const current_channel = document.URL.split("/").pop();
  // const elbierro_channel = "channelname"
  const event_emote = /ItsBoshyTime/;
  var availableBall = ["Night Ball"];//PUT ALL AVAIBLE POKEBALLS HERE
  const a_tier_balls = ["Great Cherish Ball", "Ultra Ball", "Great Ball", "Cherish Ball"]
  var b_tier_balls = [""]
  var c_tier_balls = [""]
  const randomMessages = [
    "PogChamp",
    "KappaRoss",
    "where pokemon",
    "cmon",
    "KappaPride",
    "!pokebag",
    "Kreygasm",
    "o",
    "Squid1 Squid2 Squid3 Squid2 Squid4",
    "<3",
    "€€€",
    "PogBones",
    "PogChamp",
    "KappaRoss",
    "!pokepass",
    "!pokecheck 141",
    "Kappa",
    "!tryhard",
    "!pokeraid",
    "Jebasted",
    "ResidentSleeper",
    "KappaRoss",
    "KappaPride",
    "yyesss",
    "!pokehelp",
    "!pokeraid",
    "!pokeraid",
    "!pokeraid",
    "!pokeraid",
    "!pokeraid",
    "!pokeraid",
    "!pokeraid",
    "!pokehelp",
    "!pokehelp",
    "!help",
    "PogChamp",
    "KappaRoss",
    "$$$$",
    "!wt",
    "PokPikachu",
    "!pokepass",
    "!wt",
    "$$",
    "welp",
    "!pokehelp",
    "!wt",
    "Kreygasm",
    "yeeeeess",
    "KappaRoss",
    "PogChamp",
    "KappaPride",
    "WutFace",
    "cmon rngesus",
    "!recent",
    "!pokeraid",
    "KappaRoss",
    "!pokebuddy",
    "!recent",
    "!pokebuddy",
    "!pokebuddy",
    "KappaRoss",
    "KappaRoss",
    "KappaRoss",
    "KappaRoss",
    "KappaRoss",
    "!pokebuddy",
    "LUL",
    "LUL",
    "LUL",
    "LUL",
    "LUL",
    "LUL",
    "ItsBoshyTime",
    "!pokepass",
    "yeeeeess",
    "!pokedaily",
    "next drop s-tier",
    "Kreygasm",
    "Keepo",
    "KappaRoss",
    "does somebody know a christian minecraft server?",
    "LUL",
    "KappaRoss",
    "PogChamp",
    "Kappa",
    "KappaRoss",
    "KappaPride",
    "PixelBob",
    "PokMaskedPika",
    "ImTyping",
    "TwitchLit",
    "TwitchUnity",
    "TheIlluminaty",
    "ItsBoshyTime",
    "!recent",
    "LUL",
    "Kappa",
    "!pokepass",
    "SeemsGood",
    "KappaRoss",
    "!pokedaily",
    "Kreygasm",
    "PogChamp",
    "Best stream ever",
    "test",
    "!pokedaily",
    "!pokebuddy",
    "PogU",
    "FeelsGoodMan",
    "!subgoal",
    "TriHard",
    "EZ Clap",
    "KappaPride",
    "monkaS",
    "POGGERS",
    "FeelsBadMan",
    "MonkaW",
    "NotLikeThis",
    "LUL",
  ];
  let enabled = true;
  const LOGPREFIX = `[POKECATCHER]`;
  let caught = 0;
  let tried = 0;
  let spawns = 0;
  let balance = "/";
  const client = new tmi.Client({
    options: { debug: false, skipUpdatingEmotesets: true, skipMembership:true },
    identity: {
      username: username,
      password: oauthtoken,
    },
    channels: [current_channel]
  });
  client.on("connected", function (address, port) {
      console.log(LOGPREFIX, `Bot connected successfully to ${address}:${port}`)
      activateBtn.style.color = "orange";
  })
  client.on("join", function (channel, user) {
    console.log(LOGPREFIX, `Bot joined the Stream of ${channel} as ${user}`)
    activateBtn.style.color = "green";
  })
  function createElm(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.removeChild(div.children[0]);
  }

  document.head.appendChild(createElm`
  <style>
  .pokeBtn {
      display: inline-flex;
      -webkit-box-align: center;
      align-items: center;
      -webkit-box-pack: center;
      justify-content: center;
      user-select: none;
      height: var(--button-size-default);
      width: var(--button-size-default);
      border-radius: var(--border-radius-medium);
      background-color: var(--color-background-button-text-default);
      color: var(--color-fill-button-icon);
      cursor: pointer;
  }
  </style>`);

  // activation button
  const activateBtn = createElm(`
    <span class="pokeBtn">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 980 978.9" style="fill: currentcolor;">
            <path d="M509 979h-38l-5-1A485 485 0 0 1 2 531c-1-7 0-14-2-21v-43a59 59 0 0 0 1-5 461 461 0 0 1 18-107Q66 194 201 95c67-50 143-80 226-91a480 480 0 0 1 103-2c38 3 75 10 111 22q208 70 299 271c22 48 34 100 38 153 1 7 0 14 2 20v42l-1 7a464 464 0 0 1-18 106q-43 150-164 248-117 94-267 106c-7 1-14 0-21 2ZM178 521H82c-8 0-8 0-7 7a456 456 0 0 0 8 49q33 148 153 242a406 406 0 0 0 365 72 413 413 0 0 0 304-364c0-4 1-6-5-6H704c-3 0-4 1-5 4l-2 14a212 212 0 0 1-416-14c-1-3-2-4-6-4h-97Zm165-32a147 147 0 0 0 294 0 147 147 0 0 0-294 0Z"/>
        </svg>
    </span>
  `);
  const textSpan = createElm(`
      <div class="textDiv">
        <span class="pokeCount" title="Pokemon Catch Counter">S: <span id="scount">${spawns}</span>  | T: <span id="tcount">${tried}</span> | C: <span id="ccount">${caught} </span></span>
        <p class="ar">CASH: <span id="balance">${balance} $</span></p>
      </div>
  `);
  function throwPokeBall(pokeball) {
    setTimeout(function() {client.say(current_channel, `!pokecatch ${pokeball}`)}, 6000);
    let current_tries = document.querySelector('#tcount');
    if (current_tries) {
      current_tries.innerHTML = parseInt(current_tries.innerHTML)+1
    }
  }

  function getRecommendation(message) {
    const recommendedRegex = /Recommended: ([a-zA-Z ,]+)\s*/;
    const recommendedMatch = message.match(recommendedRegex);
    if (recommendedMatch) {
      const recommendedItems = recommendedMatch[1] ? recommendedMatch[1].replace('!','').replace(' deemon', '').split(', ') : [];
      for (const ball of recommendedItems) {
        if (availableBall.some(item => item.toLowerCase() == ball.toLowerCase())) {
          return ball;
          break;
        }
      }
      return null;
    }
  }

  function randomCommunication() {
    if (random_chatter) {
      const msg = randomMessages[Math.floor(Math.random() * randomMessages.length)]
      setTimeout(function() {client.say(current_channel, msg)}, 5000);
    }
  }

  function checkBalance(){
    setTimeout(function() {client.say(current_channel, "!pokepass")}, 20000);
  }

  function buyBall(tier){
    let pb = ""
    if (tier === "A") {
      if (balance >= 1000) {
        pb = "Ultra Ball";
      } else if(balance >= 600) {
        pb = "Great Ball";
      }
    }
    if (pb) {
      setTimeout(function() {client.say(current_channel, `!pokeshop ${pb}`)}, 1000);
      setTimeout(function() {client.say(checkBalance())}, 30000);
    }
    return pb;
  }

  setTimeout(activator, 15000);
  setInterval(randomCommunication, 450000);
  setInterval(checkBalance, 1000000);
  function activator() {
      const modBtn = document.querySelector('[data-a-target="chat-settings"]');
      if (modBtn) {
          console.log(LOGPREFIX, `Checking Stream...`)
          const twitchBar = modBtn.parentElement.parentElement.parentElement.parentElement.parentElement;
          const textContainer = document.querySelector('[data-test-selector="chat-input-buttons-container"]').firstChild;
          const streamed_game = document.querySelector('a[data-a-target="stream-game-link"] span').innerHTML;
          if (twitchBar && !twitchBar.contains(activateBtn)) { // && streamed_game === "Pokémon Community Game"
              twitchBar.insertBefore(activateBtn, twitchBar.firstChild);
              textContainer.removeChild(textContainer.children[0]);
              textContainer.appendChild(textSpan);
              if (enabled) {
                  try {
                    client.connect().catch(err => {activateBtn.style.color = "red"})
                    var pokemon = "";
                    var pokedex = true;
                    var pokeball = "";
                    var tier = "";
                    var stats = 0;
                    var tryBalls = [];
                    var triedBuyingPokeball = false;
                    checkBalance();
                    client.on('message', (ch, tags, message, self) => {
                      if (tags.username && (tags.username.toLowerCase() === "elbierro" || tags.username.toLowerCase() === "pokemoncommunitygame" || tags.username.toLowerCase() === username)) {
                        const spawnMatch = message.match(/A wild (\w+) appears/);
                        if (spawnMatch) {
                          pokemon = spawnMatch[1];
                          setTimeout(function() {client.say(current_channel, "!pokecheck")}, 1500);
                        }
                        const pdexMatch = message.match(/^@envoj.*:\s*(✔|❌)$/);
                        if (pdexMatch) {
                          if(pdexMatch[1] === "❌") {
                            pokedex = false;
                          } else {
                            pokedex = true;
                          }
                        }
                        const bierroMatch = message.match(/^#(\d+):.*\| Tier: ([A-F])[^|]*\|?.*Total Stats: (\d+)/);
                        if (bierroMatch) {
                          tier = bierroMatch[2];
                          stats = bierroMatch[3];
                          triedBuyingPokeball = false;
                          console.log(LOGPREFIX, `POKEMON SPAWNED: ${pokemon} - TIER: ${tier} - STATS: ${stats} - IN POKEDEX: ${pokedex ? "YES" : "NO"}`)
                          const recommended = getRecommendation(message);
                          pokeball = recommended ? recommended : "";
                          if (tier === "A") {
                            tryBalls = [...a_tier_balls];
                            if (pokeball) {tryBalls.push(pokeball);} //APPEND RECOMMENDATED BALL TO LAST ELEMENT OF TRYBALL
                            pokeball = tryBalls.shift();//GET FIRST ELEMENT OF TRY BALLS
                            throwPokeBall(pokeball);
                          } else if (tier === "B") {
                            tryBalls = [...b_tier_balls];
                            if (stats > 450) {
                              tryBalls.unshift("Ultra Ball")
                            }
                            throwPokeBall(pokeball);
                          } else if (tier === "C") {
                            tryBalls = [...c_tier_balls];
                            const emoteMatch = message.match(event_emote);
                            if (emoteMatch || (stats > 400)) {
                              throwPokeBall(pokeball);
                            }
                          }
                          let spawned = document.querySelector('#scount');
                          spawned.innerHTML = parseInt(spawned.innerHTML)+1
                        }
                        const noPokeballMatch = message.match(/^@envoj You don't own that ball/);
                        if (noPokeballMatch) {
                          if (pokeball === "" && !triedBuyingPokeball) {
                            buyBall(tier);
                            triedBuyingPokeball = true;
                            throwPokeBall(pokeball);
                          } else {
                            pokeball = tryBalls.shift();
                            if (!pokeball) {
                              let ball = buyBall(tier);
                              pokeball = ball ? ball : ""
                            }
                            throwPokeBall(pokeball);
                          }
                        }
                        const balanceMatch = message.match(/^@envoj's Balance: \$(\d+) 🏹 Battle rating: \[\d+\] & Rank: \d+ \/ \d+ -> \(\d+ W - \d+ L\)/);
                        if (balanceMatch) {
                          balance = balanceMatch[1] ? parseInt(balanceMatch[1]) : "FAIL";
                          let b_span = document.querySelector('#balance');
                          b_span.innerHTML = balance;
                          if (balance >= 5000) {
                            setTimeout(function() {client.say(current_channel, `!pokeshop pokeball 10`)}, 1000);
                          }
                        }
                        const missMatch = message.match(/^\w+ has been caught by: ([\w, ]+)$/);
                        if (missMatch) {
                          const users = missMatch[1].split(", ").map((user) => user.trim());
                          for (const u of users) {
                            if (u === username) {
                              let current_caught = document.querySelector('#ccount');
                              current_caught.innerHTML = parseInt(current_caught.innerHTML)+1
                            }
                          }
                        }
                      }// IF MSG FROM USER / OR PCG BOT
                      if(self) return;
                    });
                  } catch(e) {
                    activateBtn.style.color = "red";
                  }
              }
          } else {console.log(LOGPREFIX, "Start aborted - No PCG Stream")}
      }
  }//ACTIVATOR
})();