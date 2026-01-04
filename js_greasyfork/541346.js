// ==UserScript==
// @name         GuresTürkiye - İsim Etiketi (v14.1 Final)
// @namespace    http://tampermonkey.net/
// @version      14.1.0
// @description  guresturkiye.net için tüm görsel hataları giderilmiş, taşma ve donma yapmayan, en kararlı isim etiketi sistemi. Copyright Elricsilverhand.
// @author       Elricsilverhand
// @match        *://*.guresturkiye.net/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-body
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541346/GuresT%C3%BCrkiye%20-%20%C4%B0sim%20Etiketi%20%28v141%20Final%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541346/GuresT%C3%BCrkiye%20-%20%C4%B0sim%20Etiketi%20%28v141%20Final%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const nameplate_palettes = {
        crimson: { "darkBackground": "#900007", "lightBackground": "#E7040F" },
        berry: { "darkBackground": "#893A99", "lightBackground": "#B11FCF" },
        sky: { "darkBackground": "#0080B7", "lightBackground": "#56CCFF" },
        teal: { "darkBackground": "#086460", "lightBackground": "#7DEED7" },
        forest: { "darkBackground": "#2D5401", "lightBackground": "#6AA624" },
        bubble_gum: { "darkBackground": "#DC3E97", "lightBackground": "#F957B3" },
        violet: { "darkBackground": "#730BC8", "lightBackground": "#972FED" },
        cobalt: { "darkBackground": "#0131C2", "lightBackground": "#4278FF" },
        clover: { "darkBackground": "#047B20", "lightBackground": "#63CD5A" },
        lemon: { "darkBackground": "#F6CD12", "lightBackground": "#FED400" },
        white: { "darkBackground": "#FFFFFF", "lightBackground": "#FFFFFF" }
    };

    const THEMES = {
        'yuji_itadori': { name: 'Yuji Itadori', videoUrl: 'https://cdn.discordapp.com/assets/content/5050c625036c997b5426c21ea78e585653a8f21e2c70ffd0bcfab485e530f2b3', textColor: '#FFFFFF', paletteKey: 'crimson' },
        'satoru_gojo': { name: 'Satoru Gojo', videoUrl: 'https://cdn.discordapp.com/assets/content/97d86485f812ba7758f0fde9320a9c27d62a8b1692c3dfa87eb66d8fb8f4ef6d', textColor: '#FFFFFF', paletteKey: 'cobalt' },
        'ryomen_sukuna': { name: 'Ryomen Sukuna', videoUrl: 'https://cdn.discordapp.com/assets/content/5a6a04d9ed8b5a31c80d91e6bb628d47417920cfb7567ff20764ec5eed6a3166', textColor: '#FFFFFF', paletteKey: 'crimson' },
        'bonsai_bahcesi': { name: 'Bonsai Bahçesi', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/nameplates_v3/bonsai/asset.webm', textColor: '#FFFFFF', paletteKey: 'bubble_gum' },
        'under_the_sea': { name: 'Under the Sea', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/nameplates_v3/under_the_sea/asset.webm', textColor: '#FFFFFF', paletteKey: 'sky' },
        'aurora': { name: 'Aurora', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/nameplates_v3/aurora/asset.webm', textColor: '#FFFFFF', paletteKey: 'teal' },
        'sun_and_moon': { name: 'Sun and Moon', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/nameplates_v3/sun_and_moon/asset.webm', textColor: '#FFFFFF', paletteKey: 'cobalt' },
        'oasis': { name: 'Oasis', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/nameplates_v3/oasis/asset.webm', textColor: '#FFFFFF', paletteKey: 'berry' },
        'touch_grass': { name: 'Touch Grass', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/nameplates_v3/touch_grass/asset.webm', textColor: '#FFFFFF', paletteKey: 'sky' },
        'spirit_moon': { name: 'Spirit Moon', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/nameplates_v2/spirit_moon/asset.webm', textColor: '#FFFFFF', paletteKey: 'violet' },
        'pixie_dust': { name: 'Pixie Dust', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/nameplates_v2/pixie_dust/asset.webm', textColor: '#FFFFFF', paletteKey: 'bubble_gum' },
        'glitch': { name: 'Glitch', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/nameplates_v2/glitch/asset.webm', textColor: '#FFFFFF', paletteKey: 'violet' },
        'starfall_tides': { name: 'Starfall Tides', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/nameplates_v2/starfall_tides/asset.webm', textColor: '#FFFFFF', paletteKey: 'teal' },
        'cozy_cat': { name: 'Cozy Cat', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/nameplates_v2/cozy_cat/asset.webm', textColor: '#FFFFFF', paletteKey: 'berry' },
        'sword_of_legend': { name: 'Sword of Legend', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/nameplates_v2/sword_of_legend/asset.webm', textColor: '#FFFFFF', paletteKey: 'cobalt' },
        'cherry_blossoms': { name: 'Cherry Blossoms', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/nameplates/cherry_blossoms/asset.webm', textColor: '#FFFFFF', paletteKey: 'berry' },
        'cat_beans': { name: 'Cat Beans', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/nameplates/cat_beans/asset.webm', textColor: '#FFFFFF', paletteKey: 'violet' },
        'spirit_of_spring': { name: 'Spirit of Spring', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/nameplates/spirit_of_spring/asset.webm', textColor: '#FFFFFF', paletteKey: 'sky' },
        'twilight': { name: 'Twilight', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/nameplates/twilight/asset.webm', textColor: '#FFFFFF', paletteKey: 'cobalt' },
        'koi_pond': { name: 'Koi Pond', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/nameplates/koi_pond/asset.webm', textColor: '#FFFFFF', paletteKey: 'sky' },
        'vengeance': { name: 'Vengeance', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/nameplates/vengeance/asset.webm', textColor: '#FFFFFF', paletteKey: 'violet' },
        'cityscape': { name: 'Cityscape', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/nameplates/cityscape/asset.webm', textColor: '#FFFFFF', paletteKey: 'violet' },
        'angels': { name: 'Angels', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/nameplates/angels/asset.webm', textColor: '#FFFFFF', paletteKey: 'bubble_gum' },
        'red_dragon': { name: 'Red Dragon', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/chance/red_dragon/asset.webm', textColor: '#FFFFFF', paletteKey: 'crimson' },
        'd20_roll': { name: 'D20 Roll', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/chance/d20_roll/asset.webm', textColor: '#FFFFFF', paletteKey: 'berry' },
        'owlbear_cub': { name: 'Owlbear Cub', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/chance/owlbear_cub/asset.webm', textColor: '#FFFFFF', paletteKey: 'bubble_gum' },
        'white_mana': { name: 'White Mana', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/spell/white_mana/asset.webm', textColor: '#FFFFFF', paletteKey: 'bubble_gum' },
        'blue_mana': { name: 'Blue Mana', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/spell/blue_mana/asset.webm', textColor: '#FFFFFF', paletteKey: 'cobalt' },
        'black_mana': { name: 'Black Mana', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/spell/black_mana/asset.webm', textColor: '#FFFFFF', paletteKey: 'violet' },
        'red_mana': { name: 'Red Mana', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/spell/red_mana/asset.webm', textColor: '#FFFFFF', paletteKey: 'crimson' },
        'green_mana': { name: 'Green Mana', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/spell/green_mana/asset.webm', textColor: '#FFFFFF', paletteKey: 'clover' },
        'cherry_blossom': { name: 'Cherry Blossom', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/nameplatetest/cherry_blossom/asset.webm', textColor: '#FFFFFF', paletteKey: 'berry' },
        'heart_bloom': { name: 'Heart Bloom', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/nameplatetest/heart_bloom/asset.webm', textColor: '#FFFFFF', paletteKey: 'bubble_gum' },
        'kawaii_gaming': { name: 'Kawaii Gaming', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/nameplatetest/kawaii_gaming/asset.webm', textColor: '#FFFFFF', paletteKey: 'sky' },
        'kitsune': { name: 'Kitsune', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/nameplatetest/kitsune/asset.webm', textColor: '#FFFFFF', paletteKey: 'cobalt' },
        'tv_woman': { name: 'TV Woman', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/paper/tv_woman/asset.webm', textColor: '#FFFFFF', paletteKey: 'violet' },
        'secret_agent': { name: 'Secret Agent', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/paper/secret_agent/asset.webm', textColor: '#FFFFFF', paletteKey: 'forest' },
        'skibidi_toilet': { name: 'Skibidi Toilet', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/paper/skibidi_toilet/asset.webm', textColor: '#FFFFFF', paletteKey: 'lemon' },
        'spirit_blossom_petals': { name: 'Spirit Blossom Petals', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/petal/spirit_blossom_petals/asset.webm', textColor: '#FFFFFF', paletteKey: 'violet' },
        'yunaras_aion_erna': { name: 'Yunara\'s Aion Er\'na', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/petal/yunaras_aion_erna/asset.webm', textColor: '#FFFFFF', paletteKey: 'cobalt' },
        'spirit_blossom_springs': { name: 'Spirit Blossom Springs', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/petal/spirit_blossom_springs/asset.webm', textColor: '#FFFFFF', paletteKey: 'teal' },
        'pile_of_bones_trick': { name: 'Pile of Bones (Trick)', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/trick_or_treat/pile_of_bones_trick/asset.webm', textColor: '#FFFFFF', paletteKey: 'berry' },
        'pile_of_bones_treat': { name: 'Pile of Bones (Treat)', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/trick_or_treat/pile_of_bones_treat/asset.webm', textColor: '#FFFFFF', paletteKey: 'cobalt' },
        'ms_spider_trick': { name: 'Ms Spider (Trick)', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/trick_or_treat/ms_spider_trick/asset.webm', textColor: '#FFFFFF', paletteKey: 'teal' },
        'ms_spider_treat': { name: 'Ms Spider (Treat)', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/trick_or_treat/ms_spider_treat/asset.webm', textColor: '#FFFFFF', paletteKey: 'violet' },
        'im_watching_yooooou_trick': { name: 'I’m Watching YoOoOou... (Trick)', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/trick_or_treat/im_watching_yooooou_trick/asset.webm', textColor: '#FFFFFF', paletteKey: 'cobalt' },
        'im_watching_yooooou_treat': { name: 'I’m Watching YoOoOou... (Treat)', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/trick_or_treat/im_watching_yooooou_treat/asset.webm', textColor: '#FFFFFF', paletteKey: 'bubble_gum' },
        'autumn_breeze': { name: 'Autumn Breeze', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/woodland_friends/autumn_breeze/asset.webm', textColor: '#FFFFFF', paletteKey: 'cobalt' },
        'petal_bloom': { name: 'Petal Bloom', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/woodland_friends/petal_bloom/asset.webm', textColor: '#FFFFFF', paletteKey: 'sky' },
        'hoppy_bois_perch': { name: 'Hoppy Boi’s Perch', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/woodland_friends/hoppy_bois_perch/asset.webm', textColor: '#FFFFFF', paletteKey: 'bubble_gum' },
        'encore_orange': { name: 'Encore! (Orange)', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/its_showtime/encore_orange/asset.webm', textColor: '#FFFFFF', paletteKey: 'lemon' },
        'encore_teal': { name: 'Encore! (Teal)', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/its_showtime/encore_teal/asset.webm', textColor: '#FFFFFF', paletteKey: 'teal' },
        'berry_bunny': { name: 'Berry Bunny', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/nameplate_bonanza/berry_bunny/asset.webm', textColor: '#FFFFFF', paletteKey: 'berry' },
        'the_same_duck': { name: 'The Same Duck', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/nameplate_bonanza/the_same_duck/asset.webm', textColor: '#FFFFFF', paletteKey: 'forest' },
        'starfall_tides_nightshade': { name: 'Starfall Tides (Nightshade)', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/nameplate_bonanza/starfall_tides_nightshade/asset.webm', textColor: '#FFFFFF', paletteKey: 'berry' },
        'starfall_tides_rose': { name: 'Starfall Tides (Rose)', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/nameplate_bonanza/starfall_tides_rose/asset.webm', textColor: '#FFFFFF', paletteKey: 'bubble_gum' },
        'starfall_tides_void': { name: 'Starfall Tides (Void)', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/nameplate_bonanza/starfall_tides_void/asset.webm', textColor: '#FFFFFF', paletteKey: 'violet' },
        'starlight_whales': { name: 'Starlight Whales', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/nameplate_bonanza/starlight_whales/asset.webm', textColor: '#FFFFFF', paletteKey: 'violet' },
        'bloomling': { name: 'Bloomling', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/nameplate_bonanza/bloomling/asset.webm', textColor: '#FFFFFF', paletteKey: 'bubble_gum' },
        'sproutling': { name: 'Sproutling', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/nameplate_bonanza/sproutling/asset.webm', textColor: '#FFFFFF', paletteKey: 'clover' },
        'twilight_fuchsia': { name: 'Twilight (Fuchsia)', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/nameplate_bonanza/twilight_fuchsia/asset.webm', textColor: '#FFFFFF', paletteKey: 'bubble_gum' },
        'twilight_dusk': { name: 'Twilight (Dusk)', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/nameplate_bonanza/twilight_dusk/asset.webm', textColor: '#FFFFFF', paletteKey: 'white' },
        'cosmic_storm': { name: 'Cosmic Storm', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/nameplate_bonanza/cosmic_storm/asset.webm', textColor: '#FFFFFF', paletteKey: 'violet' },
        'planet_rings': { name: 'Planet Rings', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/nameplate_bonanza/planet_rings/asset.webm', textColor: '#FFFFFF', paletteKey: 'cobalt' },
        'fairies': { name: 'Fairies', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/nameplate_bonanza/fairies/asset.webm', textColor: '#FFFFFF', paletteKey: 'violet' },
        'firefly_meadow': { name: 'Firefly Meadow', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/nameplate_bonanza/firefly_meadow/asset.webm', textColor: '#FFFFFF', paletteKey: 'sky' },
        'magic_hearts_orange': { name: 'Magic Hearts (Orange)', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/nameplate_bonanza/magic_hearts_orange/asset.webm', textColor: '#FFFFFF', paletteKey: 'bubble_gum' },
        'magic_hearts_blue': { name: 'Magic Hearts (Blue)', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/nameplate_bonanza/magic_hearts_blue/asset.webm', textColor: '#FFFFFF', paletteKey: 'cobalt' },
        'claptrap': { name: 'Claptrap', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/box/claptrap/asset.webm', textColor: '#FFFFFF', paletteKey: 'violet' },
        'ripper_awakens': { name: 'Ripper Awakens', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/box/ripper_awakens/asset.webm', textColor: '#FFFFFF', paletteKey: 'sky' },
        'shattered_veil': { name: 'Shattered Veil', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/box/shattered_veil/asset.webm', textColor: '#FFFFFF', paletteKey: 'berry' },
        'vault': { name: 'Vault', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/box/vault/asset.webm', textColor: '#FFFFFF', paletteKey: 'crimson' },
        'moonlit_charm': { name: 'Moonlit Charm', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/lunar_eclipse/moonlit_charm/asset.webm', textColor: '#FFFFFF', paletteKey: 'cobalt' },
        'luna_moth': { name: 'Luna Moth', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/lunar_eclipse/luna_moth/asset.webm', textColor: '#FFFFFF', paletteKey: 'bubble_gum' },
        'moon_essence': { name: 'Moon Essence', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/lunar_eclipse/moon_essence/asset.webm', textColor: '#FFFFFF', paletteKey: 'berry' },
        'gomah': { name: 'Gomah', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/rock/gomah/asset.webm', textColor: '#FFFFFF', paletteKey: 'crimson' },
        'mini_vegeta': { name: 'Mini Vegeta', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/rock/mini_vegeta/asset.webm', textColor: '#FFFFFF', paletteKey: 'cobalt' },
        'mini_goku': { name: 'Mini Goku', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/rock/mini_goku/asset.webm', textColor: '#FFFFFF', paletteKey: 'berry' },
        'dragon_ball': { name: 'Dragon Ball', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/rock/dragon_ball/asset.webm', textColor: '#FFFFFF', paletteKey: 'crimson' },
        'jet_stream': { name: 'Jet Stream', videoUrl: 'https://cdn.discordapp.com/assets/collectibles/nameplates/special_events_2/nitro_rocketfuel_nameplate/asset.webm', textColor: '#FFFFFF', paletteKey: 'violet' },
    };

    const CONFIG = {
        userId: null,
        selectedTheme: 'bonsai_bahcesi',
        gradientTone: 'dark'
    };

    function getLoggedInUserId() {
        const userAvatar = document.querySelector('.p-navgroup-link--user .avatar[data-user-id]');
        return userAvatar ? userAvatar.dataset.userId : null;
    }

    async function loadConfig() {
        CONFIG.userId = getLoggedInUserId();
        if (!CONFIG.userId) return false;
        CONFIG.gradientTone = await GM_getValue(`gradientTone_${CONFIG.userId}`, 'dark');
        let savedTheme = await GM_getValue(`selectedTheme_${CONFIG.userId}`, 'bonsai_bahcesi');
        if (!THEMES[savedTheme]) savedTheme = Object.keys(THEMES)[0];
        CONFIG.selectedTheme = savedTheme;
        return true;
    }

    async function saveConfigAndApply() {
        if (!CONFIG.userId) return;
        const newTheme = document.querySelector('.gt-theme-card.selected')?.dataset.themeKey || CONFIG.selectedTheme;
        CONFIG.selectedTheme = newTheme;
        await GM_setValue(`selectedTheme_${CONFIG.userId}`, newTheme);
        const newTone = document.querySelector('input[name="gt-gradient-tone"]:checked').value;
        CONFIG.gradientTone = newTone;
        await GM_setValue(`gradientTone_${CONFIG.userId}`, newTone);
        clearAllStyles();
        injectDynamicStyles();
        processNode(document.body);
        alert('Ayarlar kaydedildi ve uygulandı!');
        document.getElementById('gt-theme-modal-overlay').style.display = 'none';
    }

    function setupModal() {
        if (document.getElementById('gt-theme-modal-overlay')) return;
        GM_addStyle(`
            #gt-theme-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.85); display: flex; justify-content: center; align-items: center; z-index: 10000; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
            #gt-theme-modal { background: linear-gradient(135deg, #2c2f33 0%, #1e2124 100%); border-radius: 16px; box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6); width: 90%; max-width: 800px; color: #ffffff; display: flex; flex-direction: column; max-height: 90vh; overflow: hidden; animation: slideIn 0.3s ease-out; }
            @keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            #gt-modal-header { padding: 20px 40px; border-bottom: 1px solid #40444b; display: flex; justify-content: space-between; align-items: center; background-color: #1e2124; }
            #gt-modal-close-btn { background: none; border: none; color: #b9bbbe; font-size: 1.9em; cursor: pointer; padding: 5px; border-radius: 50%; transition: color 0.2s ease, transform 0.2s ease; }
            #gt-modal-close-btn:hover { color: #ff5555; transform: rotate(90deg); }
            #gt-modal-content { padding: 30px 45px; overflow-y: auto; flex-grow: 1; background-color: #2c2f33; }
            #gt-modal-content h3 { color: #b9bbbe; margin-top: 25px; margin-bottom: 20px; font-size: 1.4em; border-bottom: 3px solid #7289da; padding-bottom: 8px; font-weight: 600; text-transform: uppercase; }
            #gt-theme-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); justify-content: center; gap: 20px; margin-bottom: 30px; }
            .gt-theme-card { background: #36393f; border-radius: 12px; overflow: hidden; cursor: pointer; border: 2px solid transparent; transition: all 0.3s ease; display: flex; flex-direction: column; box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3); }
            .gt-theme-card:hover { border-color: #7289da; transform: translateY(-6px); box-shadow: 0 8px 25px rgba(114, 137, 218, 0.4); }
            .gt-theme-card.selected { border-color: #7289da; box-shadow: 0 0 0 4px rgba(114, 137, 218, 0.5); }
            .gt-theme-preview { width: 100%; height: 40px; position: relative; overflow: hidden; background-color: #202225; }
            .gt-theme-video-preview { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: 2; }
            .gt-theme-preview-overlay { position: absolute; width: 100%; height: 100%; top: 0; left: 0; z-index: 1; background-image: linear-gradient(90deg, rgba(0,0,0,0) -30%, var(--gt-preview-gradient-color) 200%); }
            .gt-theme-name { padding: 12px; font-size: 1em; color: #ffffff; text-align: center; background-color: #2f3136; border-top: 2px solid #40444b; font-weight: 600; text-transform: capitalize; }
            .gt-setting-item { margin-bottom: 25px; }
            #gt-modal-footer { padding: 20px 40px; border-top: 1px solid #40444b; display: flex; justify-content: space-between; align-items: center; background-color: #1e2124; }
            #gt-save-settings-btn { background: linear-gradient(90deg, #7289da 0%, #5865f2 100%); color: #ffffff; border: none; padding: 12px 30px; border-radius: 10px; cursor: pointer; font-size: 1.2em; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; transition: transform 0.2s ease, box-shadow 0.2s ease; }
            #gt-save-settings-btn:hover { transform: translateY(-3px); box-shadow: 0 6px 20px rgba(88, 101, 242, 0.5); }
            .gt-tone-option { display: flex; gap: 20px; margin-top: 10px; }
            .gt-tone-option input[type="radio"] { display: none; }
            .gt-tone-option label { cursor: pointer; padding: 10px 15px; background-color: #36393f; border-radius: 8px; transition: all 0.3s ease; }
            .gt-tone-option label:hover { background-color: #40444b; color: #ffffff; }
            .gt-tone-option input[type="radio"]:checked + label { background-color: #7289da; color: #ffffff; box-shadow: 0 0 0 2px rgba(114, 137, 218, 0.5); }
        `);
        const modalContainer = document.createElement('div');
        modalContainer.id = 'gt-theme-modal-overlay';
        modalContainer.style.display = 'none';
        const themeCardsHTML = Object.entries(THEMES).map(([key, themeData]) => {
            const palette = nameplate_palettes[themeData.paletteKey];
            const gradColor = CONFIG.gradientTone === 'light' ? palette.lightBackground : palette.darkBackground;
            return `
            <div class="gt-theme-card" data-theme-key="${key}" data-palette-key="${themeData.paletteKey}">
                <div class="gt-theme-preview">
                    <div class="gt-theme-preview-overlay" style="--gt-preview-gradient-color: ${gradColor};"></div>
                    <video muted loop playsinline disablepictureinpicture class="gt-theme-video-preview" src="${themeData.videoUrl}"></video>
                </div>
                <div class="gt-theme-name">${themeData.name}</div>
            </div>`;
        }).join('');
        const toneOptionsHTML = `
            <div class="gt-tone-option">
                <input type="radio" name="gt-gradient-tone" value="dark" id="dark-tone" ${CONFIG.gradientTone === 'dark' ? 'checked' : ''}>
                <label for="dark-tone">Koyu Ton</label>
                <input type="radio" name="gt-gradient-tone" value="light" id="light-tone" ${CONFIG.gradientTone === 'light' ? 'checked' : ''}>
                <label for="light-tone">Açık Ton</label>
            </div>`;
        modalContainer.innerHTML = `
            <div id="gt-theme-modal"><div id="gt-modal-header"><h2>İsim Etiketi Ayarları</h2><button id="gt-modal-close-btn">×</button></div><div id="gt-modal-content"><h3>Tema Seçimi</h3><div id="gt-theme-grid">${themeCardsHTML}</div><h3>Genel Ayarlar</h3><div class="gt-setting-item"><label>Kullanıcı ID: ${CONFIG.userId || 'Giriş Yapılmamış'}</label></div><div class="gt-setting-item"><label>Gradient Tonu:</label>${toneOptionsHTML}</div></div><div id="gt-modal-footer"><small id="gt-copyright">Copyright © Elricsilverhand</small><button id="gt-save-settings-btn">Kaydet ve Uygula</button></div></div>`;
        document.body.appendChild(modalContainer);
        modalContainer.querySelector('#gt-modal-close-btn').addEventListener('click', () => { modalContainer.style.display = 'none'; });
        modalContainer.querySelector('#gt-save-settings-btn').addEventListener('click', saveConfigAndApply);
        modalContainer.querySelectorAll('.gt-theme-card').forEach(card => {
            card.addEventListener('click', e => {
                modalContainer.querySelector('.gt-theme-card.selected')?.classList.remove('selected');
                e.currentTarget.classList.add('selected');
            });
            const video = card.querySelector('video');
            if (video) {
                card.addEventListener('mouseenter', () => video.play().catch(e => {}));
                card.addEventListener('mouseleave', () => { video.pause(); video.currentTime = 0; });
            }
        });
        modalContainer.querySelectorAll('input[name="gt-gradient-tone"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                const newTone = e.target.value;
                modalContainer.querySelectorAll('.gt-theme-card').forEach(card => {
                    const paletteKey = card.dataset.paletteKey;
                    const palette = nameplate_palettes[paletteKey];
                    if (palette) {
                        const newGradColor = newTone === 'light' ? palette.lightBackground : palette.darkBackground;
                        card.querySelector('.gt-theme-preview-overlay').style.setProperty('--gt-preview-gradient-color', newGradColor);
                    }
                });
            });
        });
    }

    function openSettingsModal() {
        const modal = document.getElementById('gt-theme-modal-overlay');
        if (!modal) return;
        modal.querySelector('.gt-theme-card.selected')?.classList.remove('selected');
        const currentCard = modal.querySelector(`.gt-theme-card[data-theme-key="${CONFIG.selectedTheme}"]`);
        if (currentCard) currentCard.classList.add('selected');
        const currentToneRadio = modal.querySelector(`input[name="gt-gradient-tone"][value="${CONFIG.gradientTone}"]`);
        if (currentToneRadio) currentToneRadio.checked = true;
        modal.style.display = 'flex';
    }

    function injectDynamicStyles() {
        if (!CONFIG.userId) return;
        document.getElementById('gt-dynamic-nameplate-style')?.remove();
        const theme = THEMES[CONFIG.selectedTheme] || Object.values(THEMES)[0];
        const palette = nameplate_palettes[theme.paletteKey];
        const gradientColor = CONFIG.gradientTone === 'light' ? palette.lightBackground : palette.darkBackground;
        const style = `
            :root {
                --gt-gradient-color: ${gradientColor};
                --gt-text-color: ${theme.textColor};
            }
            /* === GÖRSEL İYİLEŞTİRMELER v2 === */
            /* Genel Etiket Stili (Orta Boyut) */
            a.username[data-user-id="${CONFIG.userId}"] {
                position: relative;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                height: 36px;
                width: 100%;
                min-width: 140px;
                padding: 0 18px;
                vertical-align: middle;
                overflow: hidden;
                border-radius: 10px; /* Daha belirgin yuvarlaklık */
                text-decoration: none !important;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                margin: 2px 0;
                font-size: 0; /* Orijinal metnin boyutunu sıfırla */
            }
            /* Mesajlardaki Kullanıcı Paneli İçin Özel Stil (Daha Büyük) */
            .message-user-info a.username[data-user-id="${CONFIG.userId}"] {
                display: flex;
                width: 100%;
                max-width: 220px;
                height: 44px; /* Mesajlarda daha büyük ve okunaklı */
                margin-bottom: 8px; /* Alt boşluk artırıldı */
            }
            /* Etiket İçeriği */
            .gt-nameplate-container {
                position: absolute; top: 0; left: 0;
                width: 100%; height: 100%;
                display: flex; align-items: center; justify-content: center;
                pointer-events: none;
            }
            .gt-gradient-overlay {
                position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                background-image: linear-gradient(90deg, rgba(0,0,0,0) -20%, var(--gt-gradient-color) 150%);
                z-index: 1;
            }
            .gt-nameplate-video {
                position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                object-fit: cover;
                z-index: 2;
            }
            .gt-nameplate-text {
                position: relative;
                color: var(--gt-text-color) !important;
                font-weight: bold;
                text-shadow: 1px 1px 4px rgba(0,0,0,0.8);
                z-index: 3;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                padding: 0 10px;
                font-size: 15px;
                line-height: 1;
                visibility: visible !important; /* HER ZAMAN GÖRÜNÜR OLMASINI SAĞLA */
            }
             .message-user-info .gt-nameplate-text {
                font-size: 16px;
            }
            /* Orijinal içeriği gizlemek için daha güvenli yöntem */
            a.username[data-user-id="${CONFIG.userId}"][data-gt-styled="true"] > *:not(.gt-nameplate-container) {
                display: none !important;
            }
        `;
        GM_addStyle(style, { id: 'gt-dynamic-nameplate-style' });
    }

    function applyStyleToLink(userLink) {
        if (userLink.dataset.gtStyled === 'true') return;
        const usernameText = userLink.textContent.trim();
        if (!usernameText) return;
        const theme = THEMES[CONFIG.selectedTheme];
        const container = document.createElement('div');
        container.className = 'gt-nameplate-container';
        container.innerHTML = `
            <div class="gt-gradient-overlay"></div>
            <video class="gt-nameplate-video" src="${theme.videoUrl}" autoplay loop muted playsinline disablepictureinpicture></video>
            <span class="gt-nameplate-text">${usernameText}</span>`;
        Array.from(userLink.children).forEach(child => {
            if (child !== container) {
                child.style.display = 'none';
            }
        });
        userLink.appendChild(container);
        userLink.dataset.gtStyled = 'true';
    }

    function clearAllStyles() {
        const styleSheet = document.getElementById('gt-dynamic-nameplate-style');
        if (styleSheet) {
            styleSheet.remove();
        }
        document.querySelectorAll('a.username[data-gt-styled="true"]').forEach(link => {
            const container = link.querySelector('.gt-nameplate-container');
            if(container) container.remove();
            Array.from(link.children).forEach(child => {
                child.style.display = '';
            });
            delete link.dataset.gtStyled;
        });
    }

    function processNode(node) {
        if (node.nodeType !== Node.ELEMENT_NODE || !CONFIG.userId) return;
        const selector = `a.username[data-user-id="${CONFIG.userId}"]:not([data-gt-styled])`;
        if (node.matches?.(selector)) {
            applyStyleToLink(node);
        }
        node.querySelectorAll(selector).forEach(applyStyleToLink);
    }

    function addSettingsButton() {
        const navGroup = document.querySelector('.p-navgroup.p-account .p-navgroup--member');
        if (navGroup && !document.getElementById('gt-settings-btn')) {
            const settingsButton = document.createElement('a');
            settingsButton.id = 'gt-settings-btn';
            settingsButton.className = 'p-navgroup-link p-navgroup-link--iconic';
            settingsButton.title = 'İsim Etiketi Ayarları';
            settingsButton.innerHTML = `<i aria-hidden="true" style="font-style: normal; font-size: 1.2em; line-height: 1;">🎨</i>`;
            settingsButton.style.cursor = 'pointer';
            settingsButton.addEventListener('click', openSettingsModal);
            const searchButton = navGroup.querySelector('a[href="/search/"]');
            if (searchButton) {
                navGroup.insertBefore(settingsButton, searchButton);
            } else {
                navGroup.appendChild(settingsButton);
            }
        }
    }

    async function init() {
        if (!(await loadConfig())) {
            console.log("GT Etiket: Kullanıcı girişi algılanmadı, script pasif.");
            return;
        }
        setupModal();
        injectDynamicStyles();
        processNode(document.body);
        addSettingsButton();
        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                for (const addedNode of mutation.addedNodes) {
                    if (addedNode.nodeType === Node.ELEMENT_NODE) {
                        processNode(addedNode);
                        if (!document.getElementById('gt-settings-btn')) {
                            addSettingsButton();
                        }
                    }
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        GM_registerMenuCommand('İsim Etiketi Ayarları', openSettingsModal);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();