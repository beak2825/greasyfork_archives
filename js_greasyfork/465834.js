// ==UserScript==
// @name         e itch.io exclude tag May 2023 fork VN KN
// @namespace    itchiohidevn
// @description  Fork of https://greasyfork.org/en/scripts/464588-e-itch-io-exclude-tag-may-2023 . Hide games tagged Visual Novel and Kinetic Novel
// @version      6.1
// @match        *://itch.io/*
// @grant        GM_xmlhttpRequest
// @connect      itch.io
// @run-at       document-end
// @grant        GM_addElement
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @icon         https://www.google.com/s2/favicons?domain=itch.io
// @license      public domain
// @downloadURL https://update.greasyfork.org/scripts/465834/e%20itchio%20exclude%20tag%20May%202023%20fork%20VN%20KN.user.js
// @updateURL https://update.greasyfork.org/scripts/465834/e%20itchio%20exclude%20tag%20May%202023%20fork%20VN%20KN.meta.js
// ==/UserScript==
(function() {
  console.log(`${GM.info.script.name} run`)


//CAUTION: BACKUP USER SETTINGS BEFORE UPGRADE !
//CLICKING SCRIPT UPGRADE OVERWRITES CUSTOM USER SETTINGS SUCH AS BLACKLIST!

// user settings start

GM_addStyle(`
  .genre-visual-novel, .tag-kinetic-novel
{display:none}
`)
var PARALLELCONNECTION=2   //games per enquiry , be considerate and be wise
var WAITING=2000  //wait between enquiries in milliseconds , be considerate and be wise
var BLUR=true
var statview=_=>`<div id="itchotagfilterstat" style="margin-bottom: 1em; color:#858585">
Fetching / Total : ${document.querySelectorAll('.filteringqueued:not(.filtered)').length} / ${document.querySelectorAll('.filteringqueued').length}<br>
Visual Novel hidden : ${document.querySelectorAll('.genre-visual-novel').length}<br>
Kinetic Novel hidden : ${document.querySelectorAll('.tag-kinetic-novel').length}
</div>`
/* available game tags and genres

.tag-16-bit, .tag-1-bit, .tag-1gam, .tag-2d, .tag-3d, .tag-3d-platformer, .tag-4x,
.tag-7dfps, .tag-7drl, .tag-8-bit, .tag-abstract, .genre-action, .tag-action-adventure,
.tag-action-rpg, .tag-adult, .genre-adventure, .tag-aliens, .tag-alternate-history,
.tag-altgame, .tag-amiga, .tag-amstrad-cpc, .tag-animals, .tag-animation, .tag-anime,
.tag-arcade, .tag-archery, .tag-artgame, .tag-artificial-intelligence, .tag-ascii,
.tag-asteroids, .tag-atari, .tag-atmospheric, .tag-audio, .tag-augmented-reality,
.tag-automation, .tag-baldis-basics, .tag-bara, .tag-barfcade, .tag-beat-em-up,
.tag-binaural, .tag-bitsy, .tag-black-and-white, .tag-blocks, .tag-board-game,
.tag-boring, .tag-boss-battle, .tag-boys-love, .tag-brain-training, .tag-breakout,
.tag-bullet-hell, .tag-card-game, .tag-cartoon, .tag-casual, .tag-cats, .tag-celtic,
.tag-character-customization, .tag-chess, .tag-chicken, .tag-chiptune, .tag-christmas,
.tag-ciphers, .tag-city-builder, .tag-classes, .tag-clicker, .tag-colorful, .tag-combos,
.tag-comedy, .tag-comics, .tag-coming-of-age, .tag-commodore-64, .tag-construct-2,
.tag-controller, .tag-co-op, .tag-corona-sdk, .tag-cozy, .tag-crafting, .tag-creative,
.tag-creepy, .tag-creepypasta, .tag-crime, .tag-cult-classic, .tag-cute, .tag-cyberpunk,
.tag-dark, .tag-dark-fantasy, .tag-dark-humor, .tag-dating-sim, .tag-deathmatch,
.tag-deck-building, .tag-demake, .tag-destruction, .tag-detective, .tag-dice,
.tag-difficult, .tag-dinosaurs, .tag-dogs, .tag-doom, .tag-dos, .tag-dragons,
.tag-drawing, .tag-dreamcast, .tag-dreams, .tag-driving, .tag-drm-free,
.tag-dungeon-crawler, .tag-dungeons-and-dragons, .tag-dystopian, .tag-economy,
.tag-educational, .tag-emulator, .tag-endless, .tag-endless-runner, .tag-episodic,
.tag-eroge, .tag-erotic, .tag-escape-game, .tag-experimental, .tag-exploration,
.tag-explosions, .tag-fairy-tale, .tag-family-friendly, .tag-fangame, .tag-fantasy,
.tag-fantasy-console, .tag-farming, .tag-fast-paced, .tag-feel-good,
.tag-female-protagonist, .tag-fighting, .tag-first-person, .tag-fishing,
.tag-flappy-bird, .tag-flat-shading, .tag-flight, .tag-flying, .tag-fmv, .tag-fnaf,
.tag-fnf, .tag-folklore, .tag-food, .tag-football, .tag-forest, .tag-fps,
.tag-fps-platformer, .tag-frog, .tag-funny, .tag-furry, .tag-futuristic, .tag-gacha,
.tag-gameboy, .tag-gameboy-advance, .tag-gameboy-rom, .tag-game-design, .tag-gamemaker,
.tag-gamepad, .tag-gardening, .tag-gay, .tag-gbjam, .tag-gender, .tag-generator,
.tag-ggj15, .tag-ggj2020, .tag-ghosts, .tag-github, .tag-glitch, .tag-global-game-jam,
.tag-gmtkjam, .tag-godot, .tag-golf, .tag-gore, .tag-gothic, .tag-gravity,
.tag-grayscale, .tag-hack-and-slash, .tag-hacking, .tag-halloween, .tag-hand-drawn,
.tag-heist, .tag-hex-based, .tag-high-score, .tag-historical, .tag-homebrew,
.tag-horrible, .tag-horror, .tag-hypercard, .tag-idle, .tag-immersive, .tag-incremental,
.tag-indie, .tag-infinite-runner, .tag-instrument, .tag-interactive-fiction,
.tag-internet, .tag-isometric, .tag-itchfunding, .tag-job-system, .tag-jrpg,
.tag-jumping, .tag-kickstarter, .tag-kinect, .tag-kinetic-novel, .tag-kung-fu,
.tag-leap-motion, .tag-lesbian, .tag-lgbt, .tag-lgbtqia, .tag-libgdx,
.tag-life-simulation, .tag-liminal-space, .tag-live-action, .tag-local-co-op,
.local-multiplayer, .tag-lo-fi, .tag-lone-survivor, .tag-loot, .tag-love2d,
.tag-lovecraft, .tag-low-poly, .tag-lowrezjam, .tag-ludum-dare, .tag-ludum-dare-29,
.tag-ludum-dare-30, .tag-ludum-dare-31, .tag-ludum-dare-32, .tag-ludum-dare-33,
.tag-ludum-dare-34, .tag-ludum-dare-35, .tag-ludum-dare-36, .tag-ludum-dare-37,
.tag-ludum-dare-38, .tag-ludum-dare-39, .tag-ludum-dare-40, .tag-ludum-dare-41,
.tag-ludum-dare-42, .tag-ludum-dare-43, .tag-ludum-dare-44, .tag-ludum-dare-45,
.tag-ludum-dare-46, .tag-ludum-dare-47, .tag-ludum-dare-48, .tag-ludum-dare-49,
.tag-ludum-dare-50, .tag-ludum-dare-51, .tag-ludum-dare-52, .tag-magic,
.tag-magical-realism, .tag-male-protagonist, .tag-management, .tag-manga, .tag-mashup,
.tag-massively-multiplayer, .tag-math, .tag-maze, .tag-meaningful-choices, .tag-mechs,
.tag-medieval, .tag-mega-drive, .tag-meme, .tag-memoir, .tag-mental-health,
.tag-metroidvania, .tag-midi, .tag-mind-bending, .tag-minigames, .tag-minimalist,
.tag-mmorpg, .tag-moddable, .tag-moe, .tag-monsters, .tag-mountains, .tag-mouse-only,
.tag-ms-dos, .tag-msx, .tag-multiplayer, .tag-multiple-endings, .tag-music,
.tag-music-production, .tag-my-first-game-jam, .tag-mystery, .tag-mythology,
.tag-narrative, .tag-nature, .tag-neon, .tag-nes, .tag-nes-rom, .tag-ninja,
.tag-nintendo64, .tag-noir, .tag-non-eucledian, .tag-non-linear, .tag-non-violent,
.tag-norse, .tag-norway, .tag-oculus-quest, .tag-oculus-rift, .tag-one-button,
.tag-one-hit-kill, .tag-on-rails-shooter, .tag-open-source, .tag-open-world, .tag-otome,
.tag-painting, .tag-parallax, .tag-parkour, .tag-parody, .tag-party-game, .tag-pastel,
.tag-period-piece, .tag-perma-death, .tag-perspective, .tag-photorealistic,
.tag-physics, .tag-pico-8, .tag-pinball, .tag-pirates, .tag-pixel-art,
.genre-platformer, .tag-playdate, .tag-point-and-click, .tag-post-apocalyptic,
.tag-procedural, .tag-procjam, .tag-prototype, .tag-psp, .tag-psx, .tag-psychedelic,
.tag-psychological-horror, .genre-puzzle, .tag-puzzle-platformer, .tag-puzzlescript,
.tag-pvp, .tag-queer, .tag-racing, .tag-railroad, .tag-real-time,
.tag-real-time-strategy, .tag-relationship, .tag-relaxing, .tag-remake, .tag-renpy,
.tag-retro, .tag-rhythm, .tag-roadtrip, .tag-robots, .tag-roguelike, .tag-roguelite,
.tag-romance, .tag-rotation, .genre-rpg, .tag-rpgmaker, .tag-runner, .tag-sailing,
.tag-sandbox, .tag-satire, .tag-science-fiction, .tag-score-attack, .tag-screensaver,
.tag-secrets, .tag-sega-genesis, .tag-sfml, .tag-shaders, .tag-shadows,
.tag-sharecart1000, .tag-shoot-em-up, .genre-shooter, .tag-short, .tag-side-scroller,
.tag-simple, .genre-simulation, .tag-singleplayer, .tag-siren-head,
.tag-sitting-simulator, .tag-skating, .tag-skeletons, .tag-slasher, .tag-slice-of-life,
.tag-slime, .tag-soccer, .tag-sokoban, .tag-souls-like, .tag-soundtoy, .tag-sourcecode,
.tag-space, .tag-space-sim, .tag-speedrun, .tag-split-screen, .tag-spooky, .tag-spoopy,
.genre-sports, .tag-stealth, .tag-steampunk, .tag-stencyl, .tag-stop-motion,
.tag-story-rich, .genre-strategy, .tag-strategy-rpg, .tag-superhero, .tag-supernatural,
.tag-superpowers, .tag-surreal, .tag-survival, .tag-survival-horror, .tag-suspense,
.tag-swords, .tag-synthwave, .tag-tablet, .tag-tactical, .tag-tactical-rpg, .tag-tanks,
.tag-tarot, .tag-team-based, .tag-tennis, .tag-tentacles, .tag-tetris, .tag-text-based,
.tag-third-person, .tag-third-person-shooter, .tag-thriller, .tag-tic-80,
.tag-time-attack, .tag-time-travel, .tag-top-down, .tag-top-down-adventure,
.tag-top-down-shooter, .tag-touch-friendly, .tag-touhou, .tag-tower-defense,
.tag-trading, .tag-trains, .tag-transgender, .tag-traps, .tag-trashcore, .tag-trijam,
.tag-turbografx, .tag-turn-based, .tag-turn-based-combat, .tag-turn-based-strategy,
.tag-tutorial, .tag-twine, .tag-twin-stick-shooter, .tag-two-colors, .tag-two-player,
.tag-tycoon, .tag-typing, .tag-tyranobuilder, .tag-undertale, .tag-underwater,
.tag-unity, .tag-unreal-engine, .tag-upgrades, .tag-vampire, .tag-vector, .tag-vehicles,
.tag-versus, .tag-vic-20, .tag-video, .tag-violent, .tag-virtual-pet,
.tag-virtual-reality, .tag-visualization, .genre-visual-novel, .tag-voice-acting,
.tag-voice-controlled, .tag-voxel, .tag-vrchat, .tag-walking-simulator, .tag-war,
.tag-watercolor, .tag-weird, .tag-western, .tag-wizards, .tag-wobbly, .tag-word-game,
.tag-wordle, .tag-working-simulator, .tag-world-war-i, .tag-world-war-ii, .tag-yaoi,
.tag-yuri, .tag-zero-gravity, .tag-zine, .tag-zombies, .tag-zx-spectrum


available asset tags and genres



.tag-16-bit, .tag-16x16, .tag-1-bit, .tag-1gam, .tag-2d, .tag-32x32, .tag-3d,
.tag-3d-platformer, .tag-4x, .tag-7dfps, .tag-7drl, .tag-8-bit, .tag-abstract,
.genre-action, .tag-action-adventure, .tag-action-rpg, .tag-adult, .genre-adventure,
.tag-aliens, .tag-alternate-history, .tag-altgame, .tag-amiga, .tag-amstrad-cpc,
.tag-animals, .tag-animation, .tag-anime, .tag-arcade, .tag-archery, .tag-artgame,
.tag-artificial-intelligence, .tag-ascii, .tag-asset-pack, .tag-asteroids, .tag-atari,
.tag-atmospheric, .tag-audio, .tag-augmented-reality, .tag-automation, .tag-backgrounds,
.tag-bara, .tag-barfcade, .tag-beat-em-up, .tag-binaural, .tag-bitsy,
.tag-black-and-white, .tag-blender, .tag-blocks, .tag-board-game, .tag-boring,
.tag-boss-battle, .tag-boys-love, .tag-brain-training, .tag-breakout, .tag-brushes,
.tag-bullet-hell, .tag-buttons, .tag-card-game, .tag-cartoon, .tag-casual, .tag-cats,
.tag-celtic, .tag-character-customization, .tag-characters, .tag-chess, .tag-chicken,
.tag-chiptune, .tag-christmas, .tag-ciphers, .tag-city-builder, .tag-classes,
.tag-clicker, .tag-colorful, .tag-combos, .tag-comedy, .tag-comics, .tag-coming-of-age,
.tag-commodore-64, .tag-construct-2, .tag-controller, .tag-co-op, .tag-corona-sdk,
.tag-cozy, .tag-crafting, .tag-creative, .tag-creepy, .tag-creepypasta, .tag-crime,
.tag-cult-classic, .tag-cute, .tag-cyberpunk, .tag-dark, .tag-dark-fantasy,
.tag-dark-humor, .tag-dating-sim, .tag-deathmatch, .tag-deck-building, .tag-demake,
.tag-destruction, .tag-detective, .tag-dice, .tag-difficult, .tag-dinosaurs, .tag-dogs,
.tag-doom, .tag-dos, .tag-dragons, .tag-drawing, .tag-dreamcast, .tag-dreams,
.tag-driving, .tag-dungeon-crawler, .tag-dungeons-and-dragons, .tag-dystopian,
.tag-economy, .tag-educational, .tag-effects, .tag-emulator, .tag-endesga-32,
.tag-endless, .tag-endless-runner, .tag-episodic, .tag-eroge, .tag-erotic,
.tag-escape-game, .tag-experimental, .tag-exploration, .tag-explosions, .tag-fairy-tale,
.tag-family-friendly, .tag-fangame, .tag-fantasy, .tag-fantasy-console, .tag-farming,
.tag-fast-paced, .tag-fbx, .tag-feel-good, .tag-female-protagonist, .tag-fighting,
.tag-first-person, .tag-fishing, .tag-flappy-bird, .tag-flat-shading, .tag-flight,
.tag-flying, .tag-fmv, .tag-fnaf, .tag-fnf, .tag-folklore, .tag-fonts, .tag-food,
.tag-football, .tag-forest, .tag-fps, .tag-fps-platformer, .tag-frog, .tag-funny,
.tag-furry, .tag-futuristic, .tag-gacha, .tag-gameboy, .tag-gameboy-advance,
.tag-gameboy-rom, .tag-game-design, .tag-gamemaker, .tag-gamepad, .tag-gardening,
.tag-gay, .tag-gbjam, .tag-gender, .tag-generator, .tag-ggj15, .tag-ggj2020,
.tag-ghosts, .tag-github, .tag-glitch, .tag-global-game-jam, .tag-gmtkjam, .tag-godot,
.tag-golf, .tag-gore, .tag-gothic, .tag-gravity, .tag-grayscale, .tag-gui,
.tag-hack-and-slash, .tag-hacking, .tag-halloween, .tag-hand-drawn, .tag-heist,
.tag-hex-based, .tag-high-score, .tag-historical, .tag-homebrew, .tag-horrible,
.tag-horror, .tag-hypercard, .tag-icons, .tag-idle, .tag-immersive, .tag-incremental,
.tag-indie, .tag-infinite-runner, .tag-instrument, .tag-interactive-fiction,
.tag-internet, .tag-isometric, .tag-job-system, .tag-jrpg, .tag-jumping,
.tag-kickstarter, .tag-kinect, .tag-kinetic-novel, .tag-kung-fu, .tag-leap-motion,
.tag-lesbian, .tag-lgbt, .tag-lgbtqia, .tag-libgdx, .tag-life-simulation,
.tag-liminal-space, .tag-live-action, .tag-local-co-op, .local-multiplayer, .tag-lo-fi,
.tag-lone-survivor, .tag-loot, .tag-love2d, .tag-lovecraft, .tag-low-poly,
.tag-lowrezjam, .tag-ludum-dare, .tag-ludum-dare-29, .tag-ludum-dare-30,
.tag-ludum-dare-31, .tag-ludum-dare-32, .tag-ludum-dare-33, .tag-ludum-dare-34,
.tag-ludum-dare-35, .tag-ludum-dare-36, .tag-ludum-dare-37, .tag-ludum-dare-38,
.tag-ludum-dare-39, .tag-ludum-dare-40, .tag-ludum-dare-41, .tag-ludum-dare-42,
.tag-ludum-dare-43, .tag-ludum-dare-44, .tag-ludum-dare-45, .tag-ludum-dare-46,
.tag-ludum-dare-47, .tag-ludum-dare-48, .tag-ludum-dare-49, .tag-ludum-dare-50,
.tag-ludum-dare-51, .tag-ludum-dare-52, .tag-magic, .tag-magical-realism,
.tag-male-protagonist, .tag-management, .tag-manga, .tag-mashup,
.tag-massively-multiplayer, .tag-math, .tag-maze, .tag-meaningful-choices, .tag-mechs,
.tag-medieval, .tag-mega-drive, .tag-meme, .tag-memoir, .tag-mental-health,
.tag-metroidvania, .tag-midi, .tag-mind-bending, .tag-minigames, .tag-minimalist,
.tag-mmorpg, .tag-moddable, .tag-modern, .tag-modular, .tag-moe, .tag-monsters,
.tag-mountains, .tag-mouse-only, .tag-ms-dos, .tag-msx, .tag-multiplayer,
.tag-multiple-endings, .tag-music, .tag-music-production, .tag-my-first-game-jam,
.tag-mystery, .tag-mythology, .tag-narrative, .tag-nature, .tag-neon, .tag-nes,
.tag-nes-rom, .tag-ninja, .tag-nintendo64, .tag-noir, .tag-non-eucledian,
.tag-non-linear, .tag-non-violent, .tag-norse, .tag-norway, .tag-nuclear-throne,
.tag-oculus-quest, .tag-oculus-rift, .tag-one-button, .tag-one-hit-kill,
.tag-on-rails-shooter, .tag-open-source, .tag-open-world, .tag-otome, .tag-painting,
.tag-parallax, .tag-parkour, .tag-parody, .tag-party-game, .tag-pastel,
.tag-period-piece, .tag-perma-death, .tag-perspective, .tag-photorealistic,
.tag-physics, .tag-pico-8, .tag-picocad, .tag-pinball, .tag-pirates, .tag-pixel-art,
.genre-platformer, .tag-playdate, .tag-png, .tag-point-and-click, .tag-post-apocalyptic,
.tag-procedural, .tag-procjam, .tag-prototype, .tag-psp, .tag-psx, .tag-psychedelic,
.tag-psychological-horror, .genre-puzzle, .tag-puzzle-platformer, .tag-puzzlescript,
.tag-pvp, .tag-queer, .tag-racing, .tag-railroad, .tag-real-time,
.tag-real-time-strategy, .tag-relationship, .tag-relaxing, .tag-remake, .tag-renpy,
.tag-retro, .tag-rhythm, .tag-roadtrip, .tag-robots, .tag-roguelike, .tag-roguelite,
.tag-romance, .tag-rotation, .tag-royalty-free, .genre-rpg, .tag-rpgmaker, .tag-runner,
.tag-sailing, .tag-sandbox, .tag-satire, .tag-science-fiction, .tag-score-attack,
.tag-screensaver, .tag-secrets, .tag-sega-genesis, .tag-sfml, .tag-shaders,
.tag-shadows, .tag-sharecart1000, .tag-shoot-em-up, .genre-shooter, .tag-short,
.tag-side-scroller, .tag-simple, .genre-simulation, .tag-singleplayer, .tag-siren-head,
.tag-sitting-simulator, .tag-skating, .tag-skeletons, .tag-slasher, .tag-slice-of-life,
.tag-slime, .tag-soccer, .tag-sokoban, .tag-souls-like, .tag-sound-effects,
.tag-soundtoy, .tag-sourcecode, .tag-space, .tag-space-sim, .tag-speedrun,
.tag-split-screen, .tag-spooky, .tag-spoopy, .genre-sports, .tag-sprites, .tag-stealth,
.tag-steampunk, .tag-stencyl, .tag-stop-motion, .tag-story-rich, .genre-strategy,
.tag-strategy-rpg, .tag-superhero, .tag-supernatural, .tag-superpowers, .tag-surreal,
.tag-survival, .tag-survival-horror, .tag-suspense, .tag-svg, .tag-swords,
.tag-synthwave, .tag-tablet, .tag-tabletop, .tag-tactical, .tag-tactical-rpg,
.tag-tanks, .tag-tarot, .tag-team-based, .tag-template, .tag-tennis, .tag-tentacles,
.tag-tetris, .tag-text-based, .tag-textures, .tag-third-person,
.tag-third-person-shooter, .tag-thriller, .tag-tic-80, .tag-tilemap, .tag-tileset,
.tag-time-attack, .tag-time-travel, .tag-top-down, .tag-top-down-adventure,
.tag-top-down-shooter, .tag-touch-friendly, .tag-touhou, .tag-tower-defense,
.tag-trading, .tag-trains, .tag-transgender, .tag-traps, .tag-trashcore, .tag-trijam,
.tag-turbografx, .tag-turn-based, .tag-turn-based-combat, .tag-turn-based-strategy,
.tag-tutorial, .tag-twine, .tag-twin-stick-shooter, .tag-two-colors, .tag-tycoon,
.tag-typing, .tag-tyranobuilder, .tag-undertale, .tag-underwater, .tag-unity,
.tag-unreal-engine, .tag-upgrades, .tag-user-interface, .tag-vampire, .tag-vector,
.tag-vehicles, .tag-versus, .tag-vic-20, .tag-video, .tag-violent, .tag-virtual-pet,
.tag-virtual-reality, .tag-visualization, .genre-visual-novel, .tag-voice-acting,
.tag-voice-controlled, .tag-voxel, .tag-vrchat, .tag-walking-simulator, .tag-war,
.tag-watercolor, .tag-wav, .tag-weapons, .tag-weird, .tag-western, .tag-wizards,
.tag-wobbly, .tag-word-game, .tag-wordle, .tag-working-simulator, .tag-world-war-i,
.tag-world-war-ii, .tag-yaoi, .tag-yuri, .tag-zero-gravity, .tag-zine, .tag-zombies,
.tag-zx-spectrum

*/


// user settings end




if(BLUR) GM_addStyle(`
.filterable .game_cell:not(.filtered)>.game_thumb{
    filter: blur(0.5em);
}
`)
GM_addStyle(`
.filterable .game_cell:not(.filtered)>.game_cell_data>.game_title::after {
    content: 'Fetching tags';
    animation: rotating 5s linear infinite;
    display: inline-block
}
@keyframes rotating {
    from{transform:translateX(0) }
    50%{transform:translateX(3em) }
    to{transform:translateX(0) }
}
`)
  document.itchtagfiltering=_=>console.log({
     getqueries: GM_getValue(GETQUERIES,0),
     storagereused: GM_getValue(STORAGEREUSED,0),
  })
  if(Number(GM_getValue('VERSION',0))<4) GM_listValues().map(n=>GM_deleteValue(n))
  GM_setValue('VERSION',GM.info.script.version)
  var stat=_=>{
    document.querySelector('#itchotagfilterstat')?.remove()
    document.querySelector('.grid_outer').prepend(new DOMParser().parseFromString(statview(), "text/html").body.firstElementChild)
  }
  stat()
  /*
  if(!document.body.classList.contains('itchioapi')){
    GM_addElement('script', { src: 'https://static.itch.io/api.js' })
    document.body.classList.add('itchioapi')
  }
  */
  var fetchlist=[]
  var throttled=_=>{
    var i,xs=[]
    while( xs.length<=PARALLELCONNECTION-1 && (i=fetchlist.pop()) ){ xs.push(i) }
    xs.map(GM_xmlhttpRequest)
    setTimeout(throttled,xs.length>0?WAITING:500)
  }
  throttled()
  var GETQUERIES='GETQUERIES',STORAGEREUSED='STORAGEREUSED',notmatch=0
  var unique=arr=>arr.filter((v,i,a)=>a.indexOf(v)===i)
  var filtering=_=>{
    //if(typeof Itch!='undefined'){
      var m=document.querySelector('[id*="browse_games_"],[id*="browse_assets_"],[id*="search_"]')
      if(m){
        document.body.classList.add('filterable')
        ;[...m.querySelectorAll('.game_cell:not(.filteringqueued)')].map(g=>{
          g.classList.add('filteringqueued')
          var a=g.querySelector('.game_cell_data .game_link')
          var gameauthor_gamenameuri=a.href.match(/\/\/(.*?)\.itch/)[1]+'_'+a.href.match(/.io\/(.*)\/?/)[1]
          var ts=GM_getValue(gameauthor_gamenameuri,false)
          if(ts===false || ts.length===0){
            fetchlist.push({
              method: "GET",
              url: a.href+`?intent=tagfiltering&getqueries=${GM_getValue(GETQUERIES,0)}&storagereused=${GM_getValue(STORAGEREUSED,0)}`,
                // itch.io is a fabulous site for indie dev, this script aims to enhance UX and means no harm nor DDOS, so DO NOT EDIT THE ABOVE LINE
              onload: r=>{
                GM_setValue(GETQUERIES,GM_getValue(GETQUERIES,0)+1)
                ts=[...r.responseText.matchAll(/<a href="https:\/\/itch.io\/game(\-asset)?s\/((tag|genre)-.*?)"/g)].map(x=>x[2])
                console.log({game:a.text, tagsandgenres:ts, html:r.responseText})
                GM_setValue(gameauthor_gamenameuri,ts)
                ts.map(t=>g.classList.add(t))
                g.classList.add('filtered')
                g.title=unique(ts.map(x=>x.replace('tag-','').replace('genre-',''))).join('\n')
                stat()
              }
            })
            /*
            ?
            Dear itch.io web admin: could you please expose api {tags:[],genres:[]}
            if you are too busy to revamp frontend https://github.com/itchio/itch.io/issues/738
            ?
            Itch.getGameData({
              user: `${a.href.match(/\/\/(.*?)\.itch/)[1]}`,
              game: `${a.href.match(/.io\/(.*)\/?/)[1]}`,
              onComplete: d=>{
                ts=(d.tags?.map(t=>`tag-${t}`)||[]).concat( (d.genres?.map(g=>`genre-${g}`)||[]) )
                console.log({game:a.text, tagsandgenres:ts})
                GM_setValue(gameauthor_gamenameuri,ts)
                ts.map(t=>g.classList.add(t))
                g.classList.add('filtered')
                stat()
              }
            })
            */
          }else{
            GM_setValue(STORAGEREUSED,GM_getValue(STORAGEREUSED,0)+1)
            ts.map(t=>g.classList.add(t))
            g.classList.add('filtered')
            g.title=unique(ts.map(x=>x.replace('tag-','').replace('genre-',''))).join('\n')
            stat()
          }
        })
      }else{
        notmatch++
      }
    //}
    if(notmatch<300)requestAnimationFrame(filtering)
  }
  filtering()
})();
