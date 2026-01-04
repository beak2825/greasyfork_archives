// ==UserScript==
// @name         quartz themes preview switcher
// @name:zh-CN   quartz主题预览切换器
// @namespace    https://github.com/Tuscan-blue/quartz-themes-preview-switcher
// @version      1.2
// @description  Switch between different theme effects of quartz-themes quickly by using the '◀', '▶' and '🌙/🔆' buttons.
// @description:zh-CN  通过"◀"，"▶"和"🌙/🔆"按钮切换以快速预览quartz-themes的不同主题效果。
// @author       Tuscan-blue
// @license      MIT
// @match        https://quartz-themes.github.io/*
// @grant        window.onurlchange
// @downloadURL https://update.greasyfork.org/scripts/531094/quartz%20themes%20preview%20switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/531094/quartz%20themes%20preview%20switcher.meta.js
// ==/UserScript==

function switcher() {
    'use strict';

    // 网址前缀
    const baseUrl = 'https://quartz-themes.github.io/';

    // 预设路径参数数组
    const paths = [
        "80s-neon",
        "abate",
        "abecedarium",
        "absolutegruv",
        "abyssal",
        "adrenaline",
        "adwaita",
        "agate",
        "aged-whisky",
        "al-dente",
        "allium",
        "amoled-serenity",
        "anuppuccin",
        "apatheia",
        "apex",
        "arcane",
        "atom",
        "atomus",
        "aura-dark",
        "aura",
        "aurora-twilight",
        "aurora",
        "autotape",
        "ayu-light-mirage",
        "ayu-mirage",
        "base2tone",
        "behave-dark",
        "big-bold",
        "black",
        "blackbird",
        "blossom",
        "blue-topaz",
        "bolt",
        "border",
        "borealis",
        "bossidian",
        "brainhack",
        "brutalism",
        "buena-vista",
        "carbon",
        "cardstock",
        "catppuccin",
        "celestial-night",
        "charcoal",
        "chiaroscuroflow",
        "chime",
        "christmas",
        "cobalt-peacock",
        "colored-candy",
        "comfort-color-dark",
        "comfort-dark",
        "comfort-smooth",
        "comfort",
        "composer",
        "consolas",
        "covert",
        "creature",
        "creme-brulee",
        "cupertino",
        "cyber-glow",
        "cybertron-shifted",
        "cybertron",
        "dark-castle",
        "dark-clarity",
        "dark-graphite-pie",
        "dark-graphite",
        "dark-moss",
        "darkember",
        "darkyan",
        "dawn",
        "dayspring",
        "deeper-work",
        "default",
        "dekurai",
        "discordian",
        "dracula-for-obsidian",
        "dracula-gemini",
        "dracula-lyt",
        "dracula-official",
        "dracula-plus",
        "dracula-slim",
        "dune",
        "dunite",
        "dynamic-color",
        "ebullientworks",
        "eldritch",
        "elegance",
        "emerald-echo",
        "encore",
        "ethereon",
        "evangelion",
        "everblush",
        "everforest-enchanted",
        "everforest",
        "evergreen-shadow",
        "evilred",
        "faded",
        "fancy-a-story",
        "fastppuccin",
        "feather",
        "firefly",
        "flexcyon",
        "flexoki-warm",
        "flexoki",
        "focus",
        "frost",
        "fusion",
        "garden-gnome-adwaita-gtk",
        "gdct-dark",
        "gdct",
        "github-theme",
        "githubdhc",
        "gitsidian",
        "glass-robo",
        "golden-topaz",
        "green-nightmare",
        "gummy-revived",
        "hackthebox",
        "halcyon",
        "heboric",
        "hipstersmoothie",
        "hulk",
        "ia-writer",
        "ib-writer",
        "iceberg",
        "improved-potato",
        "ink",
        "ion",
        "its-theme",
        "jotter",
        "kakano",
        "kanagawa-paper",
        "kanagawa",
        "kiwi-mono",
        "kurokula",
        "lagom",
        "latex",
        "lavender-mist",
        "lemons-theme",
        "lesswrong",
        "light-bright",
        "listive",
        "lorens",
        "lumines",
        "lyt-mode",
        "mado-11",
        "mado-miniflow",
        "magicuser",
        "mammoth",
        "maple",
        "material-3",
        "material-flat",
        "material-gruvbox",
        "material-ocean",
        "micro-mike",
        "midnight-fjord",
        "midnight",
        "minimal-dark-coder",
        "minimal-dracula",
        "minimal-edge",
        "minimal-red",
        "minimal-resources",
        "minimal",
        "mint-breeze",
        "mistymauve",
        "mono-black-monochrome-charcoal",
        "monochroyou",
        "monokai",
        "moonlight",
        "mulled-wine",
        "muted-blue",
        "nebula",
        "neo",
        "neon-synthwave",
        "neovim",
        "neuborder",
        "neutral-academia",
        "nier",
        "nightfox",
        "nightingale",
        "nobb",
        "nordic",
        "northern-sky",
        "notation-2",
        "notation",
        "notswift",
        "novadust",
        "obsidian-boom",
        "obsidian-gruvbox",
        "obsidian-nord",
        "obsidian_ia",
        "obsidian_vibrant",
        "obsidianite",
        "obsidianotion",
        "obuntu",
        "oistnb",
        "old-world",
        "oldsidian-purple",
        "oledblack",
        "oliviers-theme",
        "onenice",
        "ono-sendai",
        "orange",
        "oreo",
        "origami",
        "origin",
        "overcast",
        "pale",
        "panic-mode",
        "penumbra",
        "perso",
        "phoenix",
        "pine-forest-berry",
        "pink-topaz",
        "pisum",
        "playground",
        "pln",
        "poimandres",
        "polka",
        "primary",
        "prime",
        "prism",
        "proper-dark",
        "protocolblue",
        "prussian-blue",
        "pure",
        "purple-aurora",
        "purple-owl",
        "pxld",
        "qlean",
        "red-graphite",
        "red-shadow",
        "refined-default",
        "reshi",
        "retro-windows",
        "retronotes",
        "reverie",
        "rezin",
        "rift",
        "rmaki",
        "rose-pine-moon",
        "rose-pine-2",
        "rose-pine",
        "rose-red",
        "royal-velvet",
        "sad-machine-druid",
        "sakurajima",
        "salem",
        "sanctum-reborn",
        "sanctum",
        "sandover",
        "sandstorm",
        "sanguine",
        "sea-glass",
        "seamless-view",
        "sei",
        "serenity",
        "serif",
        "serika",
        "shade-sanctuary",
        "shadeflow",
        "shiba-inu",
        "shimmering-focus",
        "simple-color",
        "simple",
        "simplicity",
        "simply-colorful",
        "sodalite",
        "solarized",
        "solitude",
        "soloing",
        "soothe",
        "space",
        "sparkling-day",
        "sparkling-night",
        "sparkling-wisdom",
        "spectrum-blue",
        "spectrum",
        "spring",
        "sqdthone",
        "strict",
        "subtlegold",
        "suddha",
        "sunbather",
        "synthwave-84",
        "synthwave",
        "terminal",
        "theme-that-shall-not-be-named",
        "things-3",
        "things",
        "tiniri",
        "tokyo-night-storm",
        "tokyo-night",
        "tomorrow-night-bright",
        "tomorrow",
        "toms-theme",
        "trace-labs",
        "transient",
        "transparent",
        "typewriter",
        "typomagical",
        "typora-vue",
        "ukiyo",
        "ultra-lobster",
        "underwater",
        "ursa",
        "vanilla-amoled-color",
        "vanilla-amoled",
        "vanilla-palettes",
        "vauxhall",
        "velvet-moon",
        "venom",
        "vercel-geist",
        "vicious",
        "violet-evening",
        "virgo",
        "vortex",
        "w95",
        "wasp",
        "wikipedia",
        "wilcoxone",
        "willemstad",
        "winter-spices",
        "wiselight",
        "wombat",
        "wy-console",
        "wyrd",
        "yue",
        "zario",
        "zen",
        "zenburn"
    ];

    const path = window.location.pathname.split("/");

    function getCurrentIndex() {
        return paths.indexOf(path[1]);
    }

    function updateURL(newPath) {
        const fixedPath = path.slice(2).join('/');
        window.location.href = baseUrl + newPath + '/' + fixedPath + window.location.hash;
    }

    function createButton(text, onClick) {
        const btn = document.createElement('button');
        btn.innerText = text;
        btn.style.position = 'fixed';
        btn.style.bottom = '60px';
        btn.style.zIndex = '10000000';
        btn.style.background = '#586ba4';
        btn.style.color = '#f5dd90';
        btn.style.border = 'none';
        btn.style.padding = '5px';
        btn.style.width = '25px';
        btn.style.height = '25px';
        btn.style.display = 'flex';
        btn.style.flexDirection = 'row';
        btn.style.alignItems = 'center';
        btn.style.justifyContent = 'center';
        btn.onclick = onClick;
        btn.style.cursor = 'pointer';
        document.body.appendChild(btn);
        return btn;
    }

    let currentIndex = getCurrentIndex();
    if (currentIndex === -1) currentIndex = 0;

    const prevBtn = createButton('◀', () => {
        if (currentIndex > 0) {
            updateURL(paths[currentIndex - 1]);
        }
    });
    prevBtn.style.right = '65px';
    prevBtn.style.borderRight = '1px solid #a4c3b2';
    // prevBtn.style.borderRadius = '5px 0 0 5px';

    const nextBtn = createButton('▶', () => {
        if (currentIndex < paths.length - 1) {
            updateURL(paths[currentIndex + 1]);
        }
    });
    nextBtn.style.right = '40px';
    nextBtn.style.borderRadius = '0 5px 5px 0';

    const htmlElement = document.querySelector("html");
    let mode = htmlElement.getAttribute("saved-theme");
    let modeText = mode === 'dark' ? '🔆' : '🌙';
    const modeBtn = createButton(modeText, null);
    modeBtn.style.right = '90px';
    modeBtn.style.borderRadius = '5px 0 0 5px';
    modeBtn.style.borderRight = '1px solid #a4c3b2';

    modeBtn.addEventListener('click', () => {
        if (mode === 'dark') {
            htmlElement.setAttribute("saved-theme", "light");
            modeText = '🌙';
            mode = 'light';
        } else {
            htmlElement.setAttribute("saved-theme", "dark");
            modeText = '🔆';
            mode = 'dark';
        }
        modeBtn.innerText = modeText;
    });
}

switcher();

(function () {
    if (window.onurlchange === null) {
        window.addEventListener('urlchange', (info) => {
            switcher();
        });
    }
})();