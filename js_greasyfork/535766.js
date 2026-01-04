// ==UserScript==
// @name         ChatboxRPG
// @namespace    https://upload.cx/users/cyncerity
// @version      0.0.9
// @description  A text-based RPG that progresses based on user activity in the chatbox
// @author       cyncerity
// @match        https://upload.cx/*
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/535766/ChatboxRPG.user.js
// @updateURL https://update.greasyfork.org/scripts/535766/ChatboxRPG.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- Selectors ---
    const CHATBOX_HEADER_SELECTOR = '#chatbox_header div';
    const MESSAGES_CONTAINER_SELECTOR = '.chatroom__messages';
    const chatboxID = "chatbox__messages-create";
    let chatbox = null;

    // --- Storage Key ---
    const STORAGE_KEY = 'chatboxRPG_state';

    // --- Default Stats ---
    const DEFAULT_STATS = {
        gold: 0,
        level: 1,
        health: 10,
        maxHealth: 10,
        strength: 10,
        toughness: 10,
        ironOre: 0
    };

    const flav_addgold = 'You received 1000 gold pieces.';

    const flav_explore_neut = [
        'You search the area but find nothing of interest.',
        'You sift through the underbrush but discover nothing useful.',
        'You examine the clearing but it seems completely barren.',
        'You poke around the trees but find no items worth taking.',
        'You look under the fallen log but it’s empty.',
        'You scan the horizon but see only more trees.',
        'You part the brambles, but they yield no path.',
        'You search a shallow puddle, but the water is clear.',
        'You run your hand along a slick rock, but feel only cold stone.',
        'You shake a low branch, but nothing falls.',
        'You peer into a dry riverbed, but see only sand.',
        'You smell the air, but detect no hint of anything unusual.',
        'You turn over a tangle of vines, but find nothing hidden.',
        'You check a pile of leaves, but uncover no trace.',
        'You listen to the silence, but hear only rustling wind.',
        'You examine a hollow tree, but it’s empty inside.',
        'You sift the soil through your fingers, but it’s just earth.',
        'You sweep aside cobwebs, but nothing is hiding behind.',
        'You brush over a patch of lichen, but it’s just growth.',
        'You inspect a broken branch, but it’s completely bare.'
    ];

    const flav_explore_bad = [
        'You trip over a branch and twist your ankle.',
        'You bump your head on a low-hanging branch and see stars.',
        'You get pricked by a hidden thorn, drawing a drop of blood.',
        'You accidentally nick your hand on a jagged rock.',
        'You slip on wet leaves and bruise your side.',
        'You stumble into a thorny bush and scratch your arm.',
        'You lose your footing on loose gravel and scrape your knee.',
        'You knock your elbow against a protruding root.',
        'A wasp stings your shoulder, leaving it red and swollen.',
        'You brush against poison ivy and your skin begins to itch.',
        'You cut your finger on a sharp shard of pottery.',
        'You misjudge a step and land awkwardly, straining your wrist.',
        'A sudden gust of wind throws you off balance, twisting your back.',
        'You catch your foot in a hidden hole, bruising your shin.',
        'You collide with a low rock face, opening a cut on your forehead.',
        'You slip into a muddy patch and pull a muscle in your leg.',
        'A swarm of biting insects descends, leaving welts on your arms.',
        'You bump your head against a hollow tree and feel a sharp pain.',
        'You step on a sharp stick, piercing the sole of your boot.',
        'You get tangled in vines and cut your forearm trying to free yourself.'
    ];

    const flav_explore_iron = [
        'You spot a glint of metal and pick up a piece of iron ore.',
        'You pry a chunk of iron ore from the rock face.',
        'You find a small vein of iron ore embedded in the stone.',
        'You scrape off a bit of iron ore from the boulder.',
        'You discover a lump of iron ore half-buried in the dirt.',
        'You uncover a rusty nugget of iron ore beneath the soil.',
        'You detect the metallic scent of iron and unearth a flake of ore.',
        'You extract a dusty fragment of iron ore from the ground.',
        'You tap the rock, hearing a metallic ring, and find a thin vein of ore.',
        'You mine a small cluster of iron ore from the cliff wall.',
        'You dig into the earth, revealing a handful of iron fragments.',
        'You chip off a piece of iron ore from a fractured seam.',
        'You notice a reddish streak in the stone and gather iron bits.',
        'You powder a bit of rusty rock to collect coarse iron ore.',
        'You break open a loose stone to expose iron-rich veins.',
        'You sift through pebbles and pick out a heavy piece of ore.',
        'You split a slab of rock, revealing veins of metallic iron.',
        'You scrape moss from a boulder and uncover hidden ore.',
        'You thrust your pick into a crevice and pry out iron ore.',
        'You search the rubble and recover a solid chunk of iron ore.'
    ];

    const flav_explore_monster = [
        'MONSTER_ENCOUNTER NOT YET IMPLEMENTED',
        'MONSTER_ENCOUNTER NOT YET IMPLEMENTED'
    ];

    const flav_train_str = [
        'You lift mighty warhammers at the blacksmith\'s forge, feeling each swing strengthen your arms.',
        'You haul heavy crates of supplies up endless castle stairs.',
        'You hoist massive anvils to develop your chest and shoulders.',
        'You swing weighted stones until your forearms burn.',
        'You practice spear thrusts against wooden dummies, powering your core.',
        'You carry sacks of grain across the courtyard for hours.',
        'You throw training javelins at heavy dummies to build raw power.',
        'You wrestle in the mud pits until your muscles ache with vigor.',
        'You row a fishing barge upstream, battling the current to bolster your back.',
        'You heft boulders onto altar platforms to pray for strength.',
        'You push a heavily laden ox cart uphill to test your leg strength.',
        'You squeeze a marble statue of a dragon to test your grip strength.',
        'You swing a chain of linked lanterns like a flail to build forearm power.',
        'You stack and unstack heavy barrels in record time, turning it into a spectator sport.',
        'You lift arcane tomes that resist your weight with enchanted bindings.',
        'You arm-wrestle a stone giant.',
        'You bench-press a panther cub under spellbound weights.',
        'You challenge a rampaging boulder to a push competition and win by a hair.',
        'You do push-ups so fast that sparks fly from the stones beneath your hands.',
        'You lift the entire castle drawbridge single-handedly to test your might.'
    ];

    const flav_train_tough = [
        'You endure ice baths in the frozen lake, hardening your resolve and skin.',
        'You carry sacks of sand on a rickety bridge to test your balance and grit.',
        'You march barefoot on rough cobblestones to strengthen your soles.',
        'You stand under pouring rain with no cloak, building your endurance.',
        'You endure hours of meditation atop a cold mountain ledge.',
        'You wrestle with massive logs until sweat and perseverance prevail.',
        'You hold a heavy hammer above your head, arms trembling but unwavering.',
        'You run laps around the battlements through a chilling wind.',
        'You partake in dawn’s freezing river ritual to steel your lungs.',
        'You pull a loaded wagon uphill, bolstering your stamina.',
        'You hug a petrified oak tree for strength, drawing its ancient toughness.',
        'You crawl through a tunnel of thorny vines without a scratch.',
        'You wear enchanted iron gauntlets to test your resilience.',
        'You let a giant spider crawl over your skin to build nerve.',
        'You stand in front of a roaring forge, letting the heat temper your will.',
        'You let a dragon’s tail flick across your armor, barely flinching.',
        'You withstand a barrage of snowballs thrown by mischievous goblins.',
        'You sit unblinking beneath a waterfall of hot lava (in your imagination).',
        'You challenge a thunderstorm to a staring contest and win.',
        'You hug a fire elemental and absorb its scorching aura without harm.'
    ];

    const flav_rest = [
        'You sink into a soft bed at the inn and awaken fully healed.',
        'You drift off to sleep by the crackling hearth and revive completely by dawn.',
        'The inn’s cozy room envelops you in warmth as you recover all your strength.',
        'You rest peacefully through the night and wake with every wound mended.',
        'You curl up under a thick quilt and rise at first light feeling whole again.',
        'The gentle murmur of the inn lulls you into restorative slumber until morning.',
        'You sleep soundly on a plush mattress and awaken free of any fatigue.',
        'You recline in a feather-stuffed bed and greet the new day fully rejuvenated.',
        'You drift between dreams in the inn’s quiet chambers and heal through the night.',
        'You rest your weary body in a comfortable room and wake at peak vitality.',
        'You surrender to deep sleep by the warm hearth and emerge completely restored.',
        'You lie on soft linens and wake refreshed, every bruise and cut gone.',
        'You dream undisturbed in the inn’s peaceful quarters and rise at full strength.',
        'You slumber in a serene room filled with the scent of fresh linens and heal fully.',
        'The hush of the inn’s corridors grants you a night of perfect rest and renewal.',
        'You close your eyes in a snug bedroll and awaken with energy coursing through you.',
        'You spend the night in the inn’s calm embrace and wake without a care or wound.',
        'You doze by candlelight until morning light and find yourself entirely mended.',
        'You rest on a down-filled pillow and awaken as strong as the day began.',
        'You sleep in the quiet comfort of the inn and greet sunrise with restored health.'
    ];

    const flav_boast_strength = [
        'Behold me crushing this brittle twig between my bare fingers—truly no task for lesser mortals.',
        'Marvel as I bend this rusted nail like it were spun from cobwebs.',
        'Observe how I crack a walnut between my thumbnail; peasants quake at such display.',
        'Watch me lift this half-empty keg with one hand—drunkards would collapse beneath its weight.',
        'Gaze upon me balancing a sack of grain on my shoulder; farmers pale before my ease.',
        'See how I bend a horseshoe around my thumb—blacksmiths themselves swear it impossible.',
        'I snap a thick hemp rope as though it were made of silk—amateurs, stand aside.',
        'I heft a heavy shield with one arm and dare any knight to test their strength against mine.',
        'I swing this thirty-pound warhammer as if it were carved from feathers.',
        'I rip a solid iron chain from its anchor and fling it yards away without effort.',
        'I uproot a young oak sapling and hurl it across the courtyard as though tossing a pebble.',
        'I lift an entire wagon clear off its wheels, then set it back down at my leisure.',
        'I hurl a thousand-pound boulder through castle gates with casual precision.',
        'I sling a full-grown warhorse over my shoulder and parade it before trembling crowds.',
        'I break through reinforced gates with a single shoulder charge—no entry stands before me.',
        'I lift a large boulder and fling it clear over the battlements, sending sentries flying.',
        'I rip the door from a siege tower and wield it like a battering ram.',
        'I bend a thick metal door frame as easily as twisting a twig.',
        'I stand firm as cavalry charges, pushing horses back with my bare hands.',
        'I am Legendary incarnate; my very flex sends shockwaves that echo through eternity.'
    ];

    const flav_boast_toughness = [
        'Behold me standing unflinching in the slightest zephyr—no petty wind can faze me.',
        'Marvel as I shrug off a tossed pebble, as if pebbles dared challenge me.',
        'Watch me endure the sting of nettles with nothing but a contemptuous grin.',
        'Witness how I remain firm as a sapling snaps beneath my boot—painless, effortless.',
        'Observe me ignore the prick of a thistle; common folk would wail in agony.',
        'Feel how I barely register the bite of an iron nail pressed to my skin.',
        'I bat aside a dagger strike as though swatting at a fly—try your luck again.',
        'I repel arrows mid-flight; these petty bolts disintegrate on my hide.',
        'I stand resolute as a boulder tumbles toward me and barely budge.',
        'I endure a beating from a training club—no bruise mars this indomitable frame.',
        'I bask in a rain of iron hail and emerge without a scratch.',
        'I weather a furnace blast and stand unscathed while others flee in terror.',
        'I let lightning crackle across my armor, unmoved by its fury.',
        'I remain unmoved as waves pummel me against jagged rocks.',
        'I storm through spiked barricades, unharmed as though made of silk.',
        'I survive a direct hit from a siege ram, chest unbroken, pride unshaken.',
        'I stand firm under a collapsing tower; dust showers me but my resolve is absolute.',
        'I shrug off an avalanche, letting icy boulders cascade over me like harmless rain.',
        'I endure the wrath of a volcanic eruption, heat trailing off me as I walk.',
        'I am Legendary endurance; the world’s greatest storms bow before my unbreakable will.'
    ];

    let stats = {};

    function loadState() {
        const json = localStorage.getItem(STORAGE_KEY);
        if (json) {
            try {
                const data = JSON.parse(json);
                stats = { ...DEFAULT_STATS, ...data.stats };
            } catch (e) {
                stats = { ...DEFAULT_STATS };
            }
        } else {
            stats = { ...DEFAULT_STATS };
        }
    }

    function saveState() {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ stats })
        );
    }

    function extractUser() {
        const el = document.querySelector('a.top-nav__username--highresolution');
        return el ? el.textContent.trim().toLowerCase() : null;
    }

    function setupMessageObserver() {
        const container = document.querySelector(MESSAGES_CONTAINER_SELECTOR);
        if (!container) return setTimeout(setupMessageObserver, 1000);
        const username = extractUser();
        new MutationObserver(muts => muts.forEach(m => m.addedNodes.forEach(n => {
            if (!(n instanceof Element)) return;
            const author = n.querySelector('.user-tag');
            const content = n.querySelector('.chatbox-message__content');
            if (author && content && author.textContent.trim() === username) {
                stats.gold += content.textContent.length;
                saveState();
                const panel = document.getElementById('charCountPanel');
                if (panel) panel.querySelector('#goldField').textContent = stats.gold;
            }
        }))).observe(container, { childList: true });
    }

    function sendMessage(messageStr) {
        if (!chatbox) {
            chatbox = document.querySelector(`#${chatboxID}`);
            if (!chatbox) return; // nothing to do if it still isn't found
        }
        chatbox.value = messageStr;
        chatbox.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Enter',
            keyCode: 13,
            which: 13,
            bubbles: true,
            cancelable: true
        }));
    }

    function removePanel() {
        const p = document.getElementById('charCountPanel');
        if (p) p.remove();
    }

    function showPanel() {
        removePanel();
        loadState();
        const currentUser = extractUser();

        const html = `
<section id="charCountPanel" class="panelV2" style="width:300px; position:fixed; top:50px; left:150px; z-index:9999; background:#fff; border:1px solid #000; overflow:auto;">
  <header class="panel__heading">
    <div class="button-holder no-space">
      <div class="button-left"><h4 style="margin:0;text-align:center;width:100%">ChatboxRPG</h4></div>
      <div class="button-right">
        <button id="helpBtn" class="form__button form__button--text">Help</button>
        <button id="optionsBtn" class="form__button form__button--text">Options</button>
        <button id="closeBtn" class="form__button form__button--text">Close</button>
      </div>
    </div>
  </header>
  <div class="panel__body" style="padding:10px;">
    <p>Gold: <b id="goldField">${stats.gold}</b></p>
    <p>Level: <b id="levelField">${stats.level}</b></p>
    <p>Health: <b id="healthField">${stats.health}</b> / <b id="maxHealthField">${stats.maxHealth}</b></p>
    <p>Strength: <b id="strengthField">${stats.strength}</b></p>
    <p>Toughness: <b id="toughnessField">${stats.toughness}</b></p>
    <p>Iron Ore: <b id="ironOreField">${stats.ironOre}</b></p>

    <div id="optionsMenu" class="form__group" style="display:none;border-top:1px solid #ccc;margin:10px 0;padding-top:10px;">
      <button id="restartBtn" class="form__button">Restart Game</button>
      <button id="addGoldBtn" class="form__button">Add 1000gp</button>
    </div>

    <div id="mainActions" class="form__group" style="display:flex;justify-content:space-evenly;border-top:1px solid #ccc;margin:10px 0;padding-top:10px;flex-wrap:wrap;">
      <button id="exploreBtn" class="form__button">Explore (100gp)</button>
      <button id="restBtn" class="form__button">Rest at Inn (100gp)</button>
      <button id="trainStatsBtn" class="form__button">Train Stats</button>
      <button id="visitSmithBtn" class="form__button">Visit Blacksmith</button>
      <button id="boastBtn" class="form__button">Boast</button>
    </div>

    <div id="trainActions" class="form__group" style="display:none;justify-content:space-evenly;border-top:1px solid #ccc;margin:10px 0;padding-top:10px;flex-wrap:wrap;">
      <button id="trainStrengthBtn" class="form__button">Train Strength (500gp)</button>
      <button id="trainToughnessBtn" class="form__button">Train Toughness (500gp)</button>
      <button id="backTrainBtn" class="form__button">Back</button>
    </div>

    <div id="smithActions" class="form__group" style="display:none;justify-content:space-evenly;border-top:1px solid #ccc;margin:10px 0;padding-top:10px;flex-wrap:wrap;">
      <button id="buySwordBtn" class="form__button">Buy Iron Sword (200gp)</button>
      <button id="backSmithBtn" class="form__button">Back</button>
    </div>

    <div id="boastActions" class="form__group" style="display:none;justify-content:space-evenly;border-top:1px solid #ccc;margin:10px 0;padding-top:10px;flex-wrap:wrap;">
      <button id="boastStrBtn" class="form__button">Boast Strength</button>
      <button id="boastToughBtn" class="form__button">Boast Toughness</button>
      <button id="backBoastBtn" class="form__button">Back</button>
    </div>

    <div id="messageArea" class="form__group" style="display:none;border-top:1px solid #ccc;margin:10px 0;padding:10px;min-height:40px;background:transparent;"></div>
  </div>
</section>`;

        document.body.insertAdjacentHTML('beforeend', html);

        const panel = document.getElementById('charCountPanel');
        const msg = panel.querySelector('#messageArea');
        const goldFld = panel.querySelector('#goldField');
        const levelFld = panel.querySelector('#levelField');
        const healthFld = panel.querySelector('#healthField');
        const maxHealthFld = panel.querySelector('#maxHealthField');
        const strengthFld = panel.querySelector('#strengthField');
        const toughnessFld = panel.querySelector('#toughnessField');
        const ironFld = panel.querySelector('#ironOreField');

        function updateFields() {
            goldFld.textContent = stats.gold;
            levelFld.textContent = stats.level;
            healthFld.textContent = stats.health;
            maxHealthFld.textContent = stats.maxHealth;
            strengthFld.textContent = stats.strength;
            toughnessFld.textContent = stats.toughness;
            ironFld.textContent = stats.ironOre;
        }

        // Help button
        panel.querySelector('#helpBtn').onclick = () => {
            msg.style.display = 'block';
            msg.textContent = 'Gold is earned each time you send a message in the chatbox. Contact Cyncerity on ULCX for any suggestions.';
        };

        // Options menu toggle
        panel.querySelector('#optionsBtn').onclick = () => {
            const m = panel.querySelector('#optionsMenu');
            m.style.display = (m.style.display === 'none') ? 'block' : 'none';
        };

        // Close panel
        panel.querySelector('#closeBtn').onclick = removePanel;

        // Restart game
        panel.querySelector('#restartBtn').onclick = () => {
            msg.style.display = 'block';
            msg.innerHTML = 'Confirm restart? <button id="yesBtn">Yes</button> <button id="noBtn" class="form__button--text">No</button>';

            panel.querySelector('#yesBtn').onclick = () => {
                stats = { ...DEFAULT_STATS };
                saveState();
                updateFields();
                msg.style.display = 'none';
            };
            panel.querySelector('#noBtn').onclick = () => {
                msg.style.display = 'none';
            };
        };

        // Explore handler
        panel.querySelector('#exploreBtn').onclick = () => {
            msg.style.display = 'block';
            if (stats.gold < 100) {
                msg.textContent = 'Not enough gold to explore!';
                return;
            }
            stats.gold -= 100;
            const d100 = Math.floor(Math.random() * 100);

            if (d100 < 50) {
                const i = Math.floor(Math.random() * flav_explore_neut.length);
                msg.textContent = flav_explore_neut[i];
            } else if (d100 < 80) {
                const i = Math.floor(Math.random() * flav_explore_bad.length);
                stats.health = Math.max(0, stats.health - 1);
                msg.textContent = `${flav_explore_bad[i]} (-1 health)`;
            } else if (d100 < 90) {
                const i = Math.floor(Math.random() * flav_explore_iron.length);
                stats.ironOre++;
                msg.textContent = `${flav_explore_iron[i]} (+1 Iron Ore)`;
            } else {
                const i = Math.floor(Math.random() * flav_explore_monster.length);
                msg.textContent = flav_explore_monster[i];
            }

            saveState();
            updateFields();
        };

        // Rest at Inn handler
        panel.querySelector('#restBtn').onclick = () => {
            msg.style.display = 'block';
            if (stats.gold < 100) {
                msg.textContent = 'Not enough gold to rest!';
                return;
            }
            stats.gold -= 100;
            const gained = stats.maxHealth - stats.health;
            stats.health = stats.maxHealth;
            const i = Math.floor(Math.random() * flav_rest.length);
            msg.textContent = `${flav_rest[i]} (+${gained} health)`;
            saveState();
            updateFields();
        };

        // Add 1000gp handler (debug)
        panel.querySelector('#addGoldBtn').onclick = () => {
            msg.style.display = 'block';
            if (currentUser === 'cyncerity' || currentUser === 'BLOOM') {
                stats.gold += 1000;
                saveState();
                updateFields();
                msg.textContent = 'Debug: 1000gp added.';
            } else {
                msg.textContent = 'This is a debug feature and has been disabled.';
            }
        };

        // Train Strength
        panel.querySelector('#trainStrengthBtn').onclick = () => {
            msg.style.display = 'block';
            if (stats.gold < 500) {
                msg.textContent = 'Not enough gold to train!';
                return;
            }
            stats.gold -= 500;
            stats.strength++;
            const i = Math.floor(Math.random() * flav_train_str.length);
            msg.textContent = `${flav_train_str[i]} (+1 Strength)`;
            saveState();
            updateFields();
        };

        // Train Toughness
        panel.querySelector('#trainToughnessBtn').onclick = () => {
            msg.style.display = 'block';
            if (stats.gold < 500) {
                msg.textContent = 'Not enough gold to train!';
                return;
            }
            stats.gold -= 500;
            stats.toughness++;
            const i = Math.floor(Math.random() * flav_train_tough.length);
            msg.textContent = `${flav_train_tough[i]} (+1 Toughness)`;
            saveState();
            updateFields();
        };

        // Toggle to Train Stats view
        panel.querySelector('#trainStatsBtn').onclick = () => {
            panel.querySelector('#mainActions').style.display = 'none';
            panel.querySelector('#trainActions').style.display = 'flex';
        };

        // Back from Train Stats view
        panel.querySelector('#backTrainBtn').onclick = () => {
            panel.querySelector('#trainActions').style.display = 'none';
            panel.querySelector('#mainActions').style.display = 'flex';
        };

        // Toggle to Blacksmith view
        panel.querySelector('#visitSmithBtn').onclick = () => {
            panel.querySelector('#mainActions').style.display = 'none';
            panel.querySelector('#smithActions').style.display = 'flex';
        };

        // Back from Blacksmith view
        panel.querySelector('#backSmithBtn').onclick = () => {
            panel.querySelector('#smithActions').style.display = 'none';
            panel.querySelector('#mainActions').style.display = 'flex';
        };

        // Toggle to Boast menu
        panel.querySelector('#boastBtn').onclick = () => {
            panel.querySelector('#mainActions').style.display = 'none';
            panel.querySelector('#boastActions').style.display = 'flex';
        };

        // Back from Boast menu
        panel.querySelector('#backBoastBtn').onclick = () => {
            panel.querySelector('#boastActions').style.display = 'none';
            panel.querySelector('#mainActions').style.display = 'flex';
        };

        // Boast Strength
        panel.querySelector('#boastStrBtn').onclick = () => {
            msg.style.display = 'block';
            const text = boastStrength();
            msg.textContent = text;
        };

        // Helper that picks, sends, and returns the strength boast line
        function boastStrength() {
            const rawIdx = Math.floor(stats.strength / 10) - 1;
            const idx = Math.min(Math.max(rawIdx, 0), flav_boast_strength.length - 1);
            const text = flav_boast_strength[idx];
            sendMessage(text);
            return text;
        }

        // Boast Toughness
        panel.querySelector('#boastToughBtn').onclick = () => {
            msg.style.display = 'block';
            const text = boastToughness();
            msg.textContent = text;
        };

        // Helper that picks, sends, and returns the toughness boast line
        function boastToughness() {
            const rawIdx = Math.floor(stats.toughness / 10) - 1;
            const idx = Math.min(Math.max(rawIdx, 0), flav_boast_toughness.length - 1);
            const text = flav_boast_toughness[idx];
            sendMessage(text);
            return text;
        }

    }

    function addButton(header) {
        const btn = document.createElement('a');
        btn.className = 'form__button form__button--text';
        btn.href = 'javascript:void(0)';
        btn.textContent = 'ChatboxRPG';
        btn.onclick = showPanel;
        header.prepend(document.createTextNode(' '));
        header.prepend(btn);
    }


    function init() { loadState(); setupMessageObserver(); const hdr = document.querySelector(CHATBOX_HEADER_SELECTOR); if (!hdr) return setTimeout(init, 1000); addButton(hdr); }
    init();
})();
