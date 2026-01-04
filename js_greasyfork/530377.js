// ==UserScript==
// @name         GeoGuessr Customizer
// @namespace    yournamespace
// @version      2.1
// @description  GeoGuessr customizer, personalize the background and font styles with gradients, transparency, and modern UI features. Enjoy a sleek, ultra-modern design with full control over colors, angles, and themes – including a live preview, random color selection, and a reset function. Elevate your GeoGuessr experience with this stylish customization tool!" 🚀🎨
// @author       Monazehra
// @match        *://*.geoguessr.com/*
// @license      MIT
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/530377/GeoGuessr%20Customizer.user.js
// @updateURL https://update.greasyfork.org/scripts/530377/GeoGuessr%20Customizer.meta.js
// ==/UserScript==

(function () {
    "use strict";

    let color1 = GM_getValue("gradientColor1", "#AFFCAF");
    let color2 = GM_getValue("gradientColor2", "#12DFF3");
    let angle = GM_getValue("gradientAngle", "135deg");
    let gradientType = GM_getValue("gradientType", "Linear");
    let selectedFont = GM_getValue("selectedFont", "Montserrat");

   const availableFonts = [
    "default",
    "Italic",
    "Montserrat",
    "Poppins",
    "Roboto",
    "Oswald",
    "Playfair Display",
    "Lora",
    "Raleway",
    "Work Sans",
    "Libre Baskerville",
    "Butler",
    "Merriweather",
    "Bebas Neue",
    "Pacifico",
    "Fira Sans",
    "Caveat",
    "Abril Fatface",
    "Josefin Sans",
    "Lobster",
    "Titillium Web",
    "Dancing Script",
    "Zilla Slab",
    "Anton",
    "Amatic SC",
    "Quicksand",
    "Bungee",
    "IBM Plex Sans",
    "Cormorant Garamond",
    "Manrope",
    "Exo",
    "Arvo",
    "Orbitron",
    "Audiowide",
    "Press Start 2P",
    "VT323",
    "Chakra Petch",
    "Russo One",
    "Teko",
    "Oxanium",
    "Zen Dots",
    "Righteous",
    "Syncopate",
    "Bowlby One SC",
    "Black Ops One",
    "Unica One",
    "Major Mono Display",
    "Shojumaru",
    "Saira Stencil One",
    "Freckle Face",
    "Monoton",
    "Barriecito",
    "Rampart One",
    "Hanalei Fill",
    "Pirata One",
    "Emilys Candy",
    "Galindo",
    "Fascinate Inline",
    "Eater",
    "Bangers",
    "Megrim",
    "Kdam Thmor Pro",
    "Metal Mania",
    "Codystar",
    "Astloch",
    "Special Elite",
    "Gochi Hand",
    "Pressurize",
"Changa One",
"Spicy Rice",
"Alfa Slab One",
"Luckiest Guy",
"Carter One",
"Boogaloo",
"Cherry Bomb One",
"Kelly Slab",
"Frijole",
"Shrikhand",
"Joti One",
"Vast Shadow",
"Yeseva One",
"Stalinist One",
"Rye",
"Trade Winds",
"UnifrakturCook",
"UnifrakturMaguntia",
"Big Shoulders Stencil Text",
"Big Shoulders Inline Text",
"Caesar Dressing",
"New Rocker",
"Mountains of Christmas",
"Creepster",
"Gravitas One",
"Finger Paint",
"Love Ya Like A Sister",
"Rubik Moonrocks",
"Monofett",
"Germania One",
"Flavors",
"Silkscreen",
"Slackey"
];

    
    availableFonts.forEach((font) => {
        if (font !== "default") {
            const link = document.createElement("link");
            link.href = `https://fonts.googleapis.com/css2?family=${font.replace(
                / /g,
                "+"
            )}&display=swap`;
            link.rel = "stylesheet";
            document.head.appendChild(link);
        }
    });

    const getRandomColor = () =>
        `#${Math.floor(Math.random() * 16777215)
            .toString(16)
            .padStart(6, "0")}`;

   const applyGradient = () => {
    const gradientDisabled = GM_getValue("gradientDisabled", false);
    const customBackground = GM_getValue("customBackground", "");
    let backgroundStyle = "";

    if (customBackground) {
        backgroundStyle = `url(${customBackground}) center center / cover no-repeat fixed`;
    } else if (gradientDisabled) {
        return removeCustomStyles();
    } else {
        color1 = GM_getValue("gradientColor1", "#AFFCAF");
        color2 = GM_getValue("gradientColor2", "#12DFF3");
        angle = GM_getValue("gradientAngle", "135deg");
        gradientType = GM_getValue("gradientType", "Linear");

        if (gradientType === "Linear") {
            backgroundStyle = `linear-gradient(${angle}, ${color1}, ${color2})`;
        } else if (gradientType === "Radial") {
            backgroundStyle = `radial-gradient(circle, ${color1}, ${color2})`;
        } else if (gradientType === "Conic") {
            backgroundStyle = `conic-gradient(from ${angle}, ${color1}, ${color2})`;
        } else if (gradientType === "Diamond") {
            backgroundStyle = `radial-gradient(closest-side at center, ${color1}, ${color2})`;
        } else if (gradientType === "Reflected") {
            backgroundStyle = `linear-gradient(${angle}, ${color1} 0%, ${color2} 50%, ${color1} 100%)`;
        } else if (gradientType === "Multi-point") {
            backgroundStyle = `radial-gradient(circle at 30% 30%, ${color1}, transparent 50%), radial-gradient(circle at 70% 70%, ${color2}, transparent 50%)`;
        }
    }

    const existingStyle = document.getElementById("geoCustomizerStyle");
    if (existingStyle) existingStyle.remove();

    const style = document.createElement("style");
    style.id = "geoCustomizerStyle";
    style.innerHTML = `
     [class^="version4_main__"],
     [class^="version4_headerWrapper__oyraB"],
     [class^="version4_sidebar__YO8X8"]
     {
        background: ${backgroundStyle} !important;
        background-attachment: fixed !important;
        transition: background 0.5s ease-in-out;
    }
    .star-background_staticBg__CjBrc { display: none !important; }
    #gradientPreview {
        background: ${backgroundStyle} !important;
    }
`;
document.head.appendChild(style);
};


    const removeCustomStyles = () => {
        const style = document.getElementById("geoCustomizerStyle");
        if (style) style.remove();
        const preview = document.getElementById("gradientPreview");
        if (preview) preview.style.background = "transparent";
    };

    const applyFont = () => {
        const existingFontStyle = document.getElementById("geoCustomizerFont");
        if (existingFontStyle) existingFontStyle.remove();

        const fontStyle = document.createElement("style");
        fontStyle.id = "geoCustomizerFont";

        if (selectedFont === "default") {
            fontStyle.innerHTML = `
            body:not(#geoCustomizerSidebar) *:not(#geoCustomizerSidebar *) {
                font-family: var(--default-font) !important;
            }
        `;
        } else {
            fontStyle.innerHTML = `
            @import url('https://fonts.googleapis.com/css2?family=${selectedFont.replace(
                / /g,
                "+"
            )}&display=swap');
            body:not(#geoCustomizerSidebar) *:not(#geoCustomizerSidebar *) {
                font-family: '${selectedFont}', sans-serif !important;
            }
        `;
        }

        document.head.appendChild(fontStyle);
    };

    const resetToDefaultStyle = () => {
        GM_setValue("gradientDisabled", true);
        GM_setValue("customBackground", "");
        GM_setValue("gradientColor1", "#AFFCAF");
        GM_setValue("gradientColor2", "#12DFF3");
        GM_setValue("gradientType", "Linear");
        GM_setValue("gradientAngle", "135deg");
        removeCustomStyles();
        location.reload();
    };
    let geoCustomizerToggleButton = null;

    const createSidebar = () => {
        const sidebar = document.createElement("div");
        sidebar.id = "geoCustomizerSidebar";
        const sidebarFontStyle = document.createElement("style");
        sidebarFontStyle.innerHTML = `
    #geoCustomizerSidebar,
    #geoCustomizerSidebar label,
    #geoCustomizerSidebar h2,
    #geoCustomizerSidebar h4,
    #geoCustomizerSidebar button,
    #geoCustomizerSidebar input[type="file"],
    #geoCustomizerSidebar input[type="color"] {
        font-family: 'Segoe UI', sans-serif !important;
    }
`;

        document.head.appendChild(sidebarFontStyle);

        sidebar.style = `
        position: fixed;
        top: 50%;
        left: -450px;
        transform: translateY(-50%);
        width: 320px;
        background: rgba(15, 15, 20, 0.95);
        backdrop-filter: blur(12px);
        color: #e0e0e0;
        padding: 25px 20px;
        border-right: 3px solid #8a2be2;
        box-shadow: 8px 0 30px rgba(0,0,0,0.6);
        transition: left 0.35s ease-in-out;
        z-index: 9999;
        border-radius: 0 18px 18px 0;
        font-family: 'Segoe UI', sans-serif;
    `;

        geoCustomizerToggleButton = document.createElement("button");
        const toggle = geoCustomizerToggleButton;

        toggle.innerText = "🔮";
        toggle.title = "Open Customizer";
        toggle.style = `
        position: fixed;
        bottom: 25px;
        left: 15px;
        width: 52px;
        height: 52px;
        border-radius: 50%;
        background-color: #8a2be2;
        color: white;
        border: none;
        font-size: 1.5em;
        cursor: pointer;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(138, 43, 226, 0.6);
        transition: background 0.3s, box-shadow 0.3s;
    `;
        const observeUrlChanges = (() => {
            let lastUrl = window.location.href;

            setInterval(() => {
                const currentUrl = window.location.href;
                if (currentUrl !== lastUrl) {
                    lastUrl = currentUrl;

                    const hidePattern = /^\/([a-z]{2}\/)?(game|multiplayer|live-challenge|duels|team-duels)/;

                    if (hidePattern.test(window.location.pathname)) {
                        geoCustomizerToggleButton.style.display = "none";
                    } else {
                        geoCustomizerToggleButton.style.display = "block";
                    }
                }
            }, 500); 
        })();

        toggle.onmouseenter = () => {
            toggle.style.backgroundColor = "#a34fe2";
            toggle.style.boxShadow = "0 4px 16px rgba(163, 79, 226, 0.8)";
        };
        toggle.onmouseleave = () => {
            toggle.style.backgroundColor = "#8a2be2";
            toggle.style.boxShadow = "0 4px 12px rgba(138, 43, 226, 0.6)";
        };
        toggle.onclick = () => {
            sidebar.style.left =
                sidebar.style.left === "0px" ? "-400px" : "0px";
        };

        const close = document.createElement("button");
        close.innerText = "✖";
        close.title = "Close";
        close.style = `
        position: absolute;
        top: 10px;
        right: 15px;
        background: none;
        border: none;
        color: #d291ff;
        font-size: 1.4em;
        cursor: pointer;
    `;
        close.onclick = () => (sidebar.style.left = "-400px");
        sidebar.appendChild(close);

        const title = document.createElement("h2");
        title.innerText = "GeoCustomizer 🔮";
        title.style = `
        text-align: center;
        color: #c084fc;
        margin-bottom: 5px;
        font-size: 1.6em;
        text-shadow: 0 0 8px #8a2be2;
    `;
        sidebar.appendChild(title);

        const madeby = document.createElement("h4");
        madeby.innerText = "Crafted by @Monazehra";
        madeby.style = `
        text-align: center;
        color: #5c5a78;
        margin-bottom: 30px;
        font-size: 0.90em;
        font-style: italic;
    `;
        sidebar.appendChild(madeby);

        const addLabel = (text) => {
            const label = document.createElement("label");
            label.innerText = text;
            label.style = "display:block; margin: 10px 0 5px; color:#d1c4e9;";
            sidebar.appendChild(label);
        };

        const createDropdown = (
            label,
            options,
            value,
            onChange,
            isFontPreview = false
        ) => {
            addLabel(label);
            const select = document.createElement("select");

            if (isFontPreview) {
                select.classList.add("font-preview");
            }

            select.style = `
        width: 100%;
        padding: 8px;
        margin-bottom: 10px;
        border-radius: 6px;
        background: #2c2c3a;
        color: #e0e0e0;
        border: none;
        font-size: 14px;
    `;

            options.forEach((opt) => {
                const option = document.createElement("option");
                option.value = opt;
                option.text = opt;
                if (isFontPreview) {
                    option.style.fontFamily =
                        opt === "default" ? "inherit" : `'${opt}', sans-serif`;
                }
                select.appendChild(option);
            });

            select.value = value;
            select.onchange = (e) => onChange(e.target.value);
            sidebar.appendChild(select);
        };

       createDropdown(
    "Gradient Type",
    ["Linear", "Radial", "Conic", "Diamond", "Reflected", "Multi-point"],
    gradientType,
    (val) => {
        GM_setValue("gradientType", val);
        GM_setValue("gradientDisabled", false);
        applyGradient();
    }
);


        createDropdown(
            "Font",
            availableFonts,
            selectedFont,
            (val) => {
                GM_setValue("selectedFont", val);
                selectedFont = val;
                applyFont();
            },
            true
        ); 

        const createColorPicker = (label, current, key) => {
            addLabel(label);
            const input = document.createElement("input");
            input.type = "color";
            input.value = current;
            input.style = `
            width: 100%;
            padding: 4px;
            margin-bottom: 14px;
            border: none;
            border-radius: 6px;
            background: #2c2c3a;
        `;
            input.oninput = (e) => {
                GM_setValue(key, e.target.value);
                GM_setValue("gradientDisabled", false);
                applyGradient();
            };
            sidebar.appendChild(input);
        };

        createColorPicker("Start Color", color1, "gradientColor1");
        createColorPicker("End Color", color2, "gradientColor2");

        const preview = document.createElement("div");
        preview.id = "gradientPreview";
        preview.style = `
        width: 100%;
        height: 100px;
        border: 1px solid #8a2be2;
        border-radius: 12px;
        margin: 14px 0;
        box-shadow: inset 0 0 10px rgba(138,43,226,0.2);
        transition: background 0.3s ease-in-out;
    `;
        sidebar.appendChild(preview);

        const createButton = (
            text,
            onClick,
            bg = "#8a2be2",
            hover = "#a34fe2"
        ) => {
            const btn = document.createElement("button");
            btn.innerText = text;
            btn.style = `
            padding: 10px;
            margin-bottom: 12px;
            width: 100%;
            border-radius: 8px;
            background: ${bg};
            color: white;
            border: none;
            font-weight: bold;
            cursor: pointer;
            transition: background 0.3s, box-shadow 0.3s;
            box-shadow: 0 0 10px rgba(138, 43, 226, 0.3);
            margin-bottom: 30px;
        `;
            btn.onmouseenter = () => {
                btn.style.background = hover;
                btn.style.boxShadow = "0 0 14px rgba(163, 79, 226, 0.6)";
            };
            btn.onmouseleave = () => {
                btn.style.background = bg;
                btn.style.boxShadow = "0 0 10px rgba(138, 43, 226, 0.3)";
            };
            btn.onclick = onClick;
            sidebar.appendChild(btn);
        };

        createButton("Random Colors", () => {
            const c1 = getRandomColor();
            const c2 = getRandomColor();
            GM_setValue("gradientColor1", c1);
            GM_setValue("gradientColor2", c2);
            GM_setValue("gradientDisabled", false);
            applyGradient();
            const inputs = sidebar.querySelectorAll('input[type="color"]');
if (inputs.length >= 2) {
    inputs[0].value = c1;
    inputs[1].value = c2;
}
        });

        const divider = document.createElement("div");
        divider.style = `
    height: 1px;
    width: 100%;
    background: linear-gradient(to right, transparent, #8a2be2, transparent);
    box-shadow: 0 0 8px rgba(138, 43, 226, 0.4);
    margin: 20px 0 20px;
`;
        sidebar.appendChild(divider);

        const backgroundtitle = document.createElement("h4");
        backgroundtitle.innerText = "or choose your own background";
        backgroundtitle.style = `
    text-align: center;
    color: #5c5a78;
    margin-bottom: 8px;
    font-size: 0.95em;
    font-style: italic;
    letter-spacing: 0.3px;
`;
        sidebar.appendChild(backgroundtitle);

        const upload = document.createElement("input");
        upload.type = "file";
        upload.accept = "image/*";
        upload.style = `
        margin-bottom: 12px;
        width: 100%;
        background: #2c2c3a;
        color: white;
        padding: 6px;
        border-radius: 6px;
    `;
        upload.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    GM_setValue("customBackground", e.target.result);
                    GM_setValue("gradientDisabled", false);
                    applyGradient();
                };
                reader.readAsDataURL(file);
            }
        };
        sidebar.appendChild(upload);

        createButton("🧹 Reset All", resetToDefaultStyle, "#555", "#444");

        document.body.appendChild(toggle);
        document.body.appendChild(sidebar);
    };

    applyGradient();
    applyFont();
    createSidebar();
})();
