// ==UserScript==
// @name         E-Hentai Tag Selector
// @namespace    http://tampermonkey.net/
// @version      4.0.10
// @description  a floating tag selection panel for e-hentai.org search
// @author       Orgacord
// @match        https://e-hentai.org/*
// @match        https://exhentai.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531923/E-Hentai%20Tag%20Selector.user.js
// @updateURL https://update.greasyfork.org/scripts/531923/E-Hentai%20Tag%20Selector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        let searchInput = document.getElementById("f_search");
        if (!searchInput) return;
        console.log("Panel script started");

        // shit work (maybe there is a better way but fuck it)
        const tags = {
            "male": ["big penis", "muscular", "age regression", "age progression", "abortion", "absorption","adventitious mouth","adventitious penis","afro","ahegao","albino","alien","all the way through","amputee","anal","anal birth","anal intercource","anal prolapse","analphagia","angel","animal on animal","animal on furry","animegao","anorexic","apparel bukkake","apron","armpit licking","armpit sex","asphyxiation","ass expansion","assjob","autofellatio","bald","ball caressing","ball sucking","balljob","balls expansion","bandages","bandaid","bat boy","bbm","bdsm","bear", "beauty mark", "bee boy", "bestiality", "big areolae", "big ass", "big balls", "big breasts", "big lips", "big muscles", "big nipples","bike shorts", "bikini", "bird boy", "bisexual", "bite mark", "blackmail", "blind", "blindfold", "blood", "bloomers", "blowjob", "blowjob face","body modification", "body painting", "body swap", "body writing", "bodystocking", "bodysuit", "bondage", "braces", "brain fuck", "breast expansion","breast feeding", "bride", "brother", "bukkake", "bull", "bunny boy", "burping", "business suit", "butler", "camel", "cannibalism", "cashier", "cat", "catboy", "cbt", "centaur", "cervix prolapse", "chastity belt", "cheating", "cheerleader", "chikan", "chinese dress", "chloroform", "christmas", "clamp", "clit insertion", "clit stimulation", "cloaca insertion", "clone", "closed eyes", "clothed female nude male", "clown", "coach", "cock ring", "cockphagia", "cockslapping", "collar", "condom", "confinement", "conjoined", "coprophagia", "corpse", "corruption", "corset", "cosplaying", "cousin", "cowman", "crab", "crossdressing", "crotch tattoo", "crown", "crying", "cum bath", "cumflation", "cunnilingus", "cuntboy", "dark nipples", "dark sclera", "dark skin", "deepthroat", "deer", "deer boy", "demon", "denki anma", "detached sleeves", "diaper", "dickgirl on male", "dicknipples", "dilf", "dinosaur", "dismantling", "dog", "dog boy", "doll joints","dolphin", "domination loss", "donkey", "double anal", "double blowjob","double penetration", "dougi", "draenei", "dragon", "drill hair", "drugs","drunk", "ear fuck", "eel", "eggs", "electric shocks", "elephant", "elephant boy","elf", "emotionless sex", "enema", "exhibitionism", "exposed clothing", "eye penetration","eye-covering bang", "eyemask", "eyepatch", "facesitting", "facial hair", "fairy","fanny packing", "farting", "father", "feminization", "filming", "first person perspective","fish", "fishnets", "fisting", "focus anal", "focus blowjob", "focus paizuri", "food on body","foot insertion", "foot licking", "footjob", "forced exposure", "forniphilia", "fox", "fox boy","freckles", "frog", "frog boy", "frottage", "full tour", "fundoshi", "furry", "gag", "gang rape","gaping", "garter belt", "gasmask", "gender change", "gender morph", "genital piercing", "ghost","giant", "giant sperm", "gijinka", "giraffe boy", "glasses", "glory hole", "gloves", "goat", "goblin","gokkun", "gorilla", "gothic lolita", "grandfather", "group", "growth", "guro", "gyaru-oh", "gymshorts","haigure", "hair buns", "hairjob", "hairy", "hairy armpits", "halo", "handicapped", "handjob", "hanging","harem", "harness", "harpy","headphones", "heterochromia", "hidden sex", "high heels", "hijab", "hood", "horns", "horse", "horse boy", "horse cock", "hotpants", "huge penis", "human cattle","human on furry", "humiliation", "hyena boy", "impregnation", "incest", "infantilism", "inflation", "insect", "insect boy", "inseki", "internal urination", "inverted nipples", "invisible", "josou seme", "kangaroo", "kappa", "kemonomimi", "kigurumi pajama", "kimono", "kindergarten uniform", "kissing", "kodomo doushi", "kunoichi", "lab coat", "lactation", "large insertions", "large tattoo", "latex", "layer cake", "leash", "leg lock", "leotard", "lingerie", "lion", "lipstick mark", "living clothes", "lizard guy", "long tongue", "low bestiality", "low guro", "low incest", "low scat", "low shotacon", "low smegma", "machine", "maggot", "magical girl", "maid", "makeup", "males only", "masked face", "masturbation", "mecha boy", "merman", "mesugaki", "mesuiki", "metal armor", "midget", "miko", "military", "milking", "mind break", "mind control", "miniguy", "minotaur", "mmm threesome","monkey", "monkey boy", "monoeye", "monster", "moral degeneration", "mouse", "mouse boy", "mouth mask", "multimouth blowjob", "multiple arms", "multiple assjob", "multiple footjob", "multiple handjob", "multiple nipples", "multiple orgasms", "multiple penises", "multiple straddling", "muscle", "muscle growth", "mute","nakadashi", "navel birth", "navel fuck", "nazi", "necrophilia", "netorare", "netorase", "ninja", "nipple birth","nipple fuck", "nipple piercing", "nipple stimulation", "no balls", "nose fuck", "nose hook", "nun", "nurse", "octopus", "oil", "old man", "omorashi", "onahole", "oni", "orc", "orgasm denial", "ostrich", "otokofutanari","otter boy", "oyakodon", "painted nails", "paizuri", "panda boy", "panther", "pantyhose", "pantyjob", "parasite", "pasties", "pegasus", "pegging", "penis birth", "penis enlargement", "personality excretion", "petplay", "petrification","phimosis", "phone sex", "piercing", "pig", "pig man", "pillory", "pirate", "piss drinking", "pixie cut", "plant boy", "pole dancing", "policeman", "ponytail", "possession", "pregnant", "prehensile hair", "priest", "prolapse", "property tag","prostate massage", "prostitution", "pubic stubble", "public use", "pussyboys only", "rabbit", "raccoon boy", "randoseru","rape", "reptile", "retractable penis", "rhinoceros", "rimjob", "robot", "ryona", "saliva", "scar", "scat", "school gym uniform", "school swimsuit", "schoolboy uniform", "schoolgirl uniform", "scrotal lingerie", "selfcest","sex toys", "shared senses", "shark", "shark boy", "shaved head", "sheep", "sheep boy", "shibari", "shimaidon", "shimapan", "shotacon", "shrinking", "skeleton", "skinsuit", "skunk boy", "slave", "sleeping", "slime", "slime boy", "slug", "small penis", "smalldom", "smegma", "smell", "smoking", "snake", "snake boy", "snuff", "sockjob", "sole male", "sole pussyboy", "solo action", "spanking", "speculum", "spider", "spider boy", "squid boy", "squirrel boy", "ssbbm", "steward", "stewardess", "stirrup legwear", "stockings", "stomach deformation", "straitjacket", "strap-on", "stretching", "stuck in wall", "sumata", "sundress", "sunglasses", "sweating", "swimsuit", "swinging", "syringe", "table masturbation", "tail", "tail plug", "tailjob", "tailphagia", "tall man", "tanlines", "teacher", "tentacles", "thick eyebrows", "thigh high boots", "tiara", "tickling", "tiger", "tights", "toddlercon", "tomgirl", "tooth brushing", "torture", "tracksuit", "trampling", "transformation", "transparent clothing", "triple anal", "triple penetration", "tube", "turtle", "tutor", "twins", "twintails", "unbirth", "uncle", "underwater", "unicorn", "unusual insertions", "unusual pupils", "unusual teeth", "urethra insertion", "urination", "vacbed", "vaginal birth", "vampire", "very long hair", "virginity", "vomit", "vore", "voyeurism", "vtuber", "waiter", "waitress", "weight gain", "wet clothes", "whale", "whip", "widower", "wings", "witch", "wolf", "wolf boy", "wooden horse", "worm", "wormhole", "wrestling", "x-ray", "yandere", "yaoi", "zebra", "zombie"],
            "female": ["abortion", "absorption", "adventitious mouth", "adventitious penis", "adventitious vagina", "afro", "alien girl","all the way through", "amputee", "anal", "anal birth", "anal intercourse", "anal prolapse", "analphagia", "angel","animal on animal", "animal on furry", "animegao", "anorexic", "apparel bukkake", "apron", "armpit licking", "armpit sex","asphyxiation", "ass expansion", "assjob", "aunt", "autofellatio", "autopaizuri", "bald", "ball caressing", "ball sucking","ball-less shemale", "balljob", "balls expansion", "bandages", "bandaid", "bat girl", "bbw", "bdsm", "bear", "bear girl","beauty mark", "bee girl", "bestiality", "big areolae", "big ass", "big balls", "big breasts", "big clit", "big lips", "big muscles", "big nipples", "big penis", "big vagina", "bike shorts", "bikini", "bird girl", "bisexual", "bite mark", "blackmail", "blind", "blindfold", "blood", "bloomers", "blowjob", "blowjob face", "body modification", "body painting", "body swap", "body writing", "bodystocking", "bodysuit", "bondage", "braces", "brain fuck", "breast expansion", "breast feeding", "breast reduction", "bride", "bukkake","bunny girl", "burping", "business suit", "butler", "cannibalism", "cashier", "cat", "catfight", "catgirl", "cbt", "centaur", "cervix penetration", "cervix prolapse", "chastity belt", "cheating", "cheerleader", "chikan", "chinese dress", "chloroform", "christmas", "clamp", "clit growth", "clit insertion", "clit stimulation", "clone", "closed eyes", "clothed male nude female", "clothed paizuri", "clown", "coach", "cock ring", "cockphagia", "cockslapping", "collar", "condom", "confinement", "conjoined", "coprophagia", "corpse", "corruption", "corset", "cosplaying", "cousin", "cow", "cowgirl", "crab", "crossdressing", "crotch tattoo", "crown","crying", "cum bath", "cum in eye", "cum swap", "cumflation", "cunnilingus", "cuntbusting", "dark nipples", "dark sclera","dark skin", "daughter", "deepthroat", "deer", "deer girl", "defloration", "demon girl", "denki anma", "detached sleeves","diaper", "dickgirl on dickgirl", "dickgirl on female", "dickgirls only", "dicknipples", "dinosaur", "dismantling", "dog","dog girl", "doll joints", "dolphin", "domination loss", "donkey", "double anal", "double blowjob", "double penetration","double vaginal", "dougi", "draenei", "dragon", "drill hair", "drugs", "drunk", "ear fuck", "eel", "eggs", "electric shocks","elephant", "elephant girl", "elf", "emotionless sex", "enema", "exhibitionism", "exposed clothing", "eye penetration","eye-covering bang", "eyemask", "eyepatch", "facesitting", "facial hair", "fairy", "fanny packing", "farting", "females only","femdom", "fff threesome", "fft threesome","filming", "fingering", "first person perspective", "fish", "fishnets", "fisting", "focus anal", "focus blowjob","focus paizuri", "food on body", "foot insertion", "foot licking", "footjob", "forced exposure", "forniphilia", "fox", "fox girl", "freckles", "frog", "frog girl", "frottage", "full tour", "full-packaged futanari", "fundoshi", "furry", "futanari", "futanarization", "gag", "gang rape", "gaping", "garter belt", "gasmask", "gender change", "gender morph", "genital piercing", "ghost", "giant sperm", "giantess", "gigantic breasts", "gijinka", "giraffe girl", "glasses", "glory hole", "gloves", "goat", "goblin", "gokkun", "gothic lolita", "granddaughter", "grandmother", "group", "growth", "guro", "gyaru", "gymshorts", "haigure", "hair buns", "hairjob", "hairy", "hairy armpits", "halo", "handicapped", "handjob", "hanging", "harem", "harness", "harpy", "headless", "headphones", "heterochromia", "hidden sex", "high heels", "hijab", "hood", "horns", "horse", "horse cock", "horse girl", "hotpants", "huge breasts", "huge penis", "human cattle", "human on furry", "humiliation", "hyena girl", "impregnation", "incest", "infantilism", "inflation", "insect", "insect girl", "inseki", "internal urination", "inverted nipples", "invisible","kangaroo", "kappa", "kemonomimi", "kigurumi pajama", "kimono", "kindergarten uniform", "kissing", "kneepit sex", "kodomo doushi","kunoichi", "lab coat", "lactation", "large insertions", "large tattoo", "latex", "layer cake", "leash", "leg lock", "legjob","leotard", "lingerie", "lioness", "lipstick mark", "living clothes", "lizard girl", "lolicon", "long tongue", "low bestiality","low guro", "low incest", "low lolicon", "low scat", "low smegma", "machine", "maggot", "magical girl", "maid", "makeup","male on dickgirl", "masked face", "masturbation", "mecha girl", "menstruation", "mermaid", "mesugaki", "mesuiki", "metal armor","midget", "miko", "milf", "military", "milking", "mind break", "mind control", "minigirl", "monkey", "monkey girl", "monoeye","monster girl", "moral degeneration", "moth girl", "mother", "mouse", "mouse girl", "mouth mask", "multimouth blowjob", "multiple arms","multiple assjob", "multiple breasts", "multiple footjob", "multiple handjob", "multiple nipples", "multiple orgasms", "multiple paizuri","multiple penises", "multiple straddling", "multiple vaginas", "muscle", "muscle growth", "mute", "nakadashi", "navel birth", "navel fuck","nazi","necrophilia", "netorare", "netorase", "niece", "nipple birth", "nipple expansion", "nipple fuck", "nipple piercing","nipple stimulation", "nose fuck", "nose hook", "nun", "nurse", "octopus", "oil", "old lady", "omorashi", "onahole","oni", "oppai loli", "orc", "orgasm denial", "otter girl", "oyakodon", "painted nails", "paizuri", "panda girl","pantyhose", "pantyjob", "parasite", "pasties", "pegasus", "penis birth", "penis enlargement", "personality excretion","petplay", "petrification", "phimosis", "phone sex", "piercing", "pig", "pig girl", "pillory", "pirate", "piss drinking","pixie cut", "plant girl", "pole dancing", "policewoman", "ponygirl", "ponytail", "possession", "pregnant","prehensile hair", "prolapse", "property tag", "prostate massage", "prostitution", "pubic stubble", "public use","rabbit", "raccoon girl", "race queen", "randoseru", "rape", "real doll", "reptile", "retractable penis", "rhinoceros","rimjob", "robot", "ryona", "saliva", "sarashi", "scar", "scat", "scat insertion", "school gym uniform", "school swimsuit","schoolboy uniform", "schoolgirl uniform", "scrotal lingerie", "selfcest", "sex toys", "shapening", "shared senses","shark", "shark girl", "shaved head", "sheep", "sheep girl", "shemale", "shibari", "shimaidon", "shimapan", "shrinking","sister", "skeleton", "skinsuit", "skunk girl", "slave", "sleeping", "slime", "slime girl", "slug", "small breasts","small penis", "smalldom", "smegma", "smell", "smoking", "snail girl", "snake", "snake girl", "snuff", "sockjob","sole dickgirl", "sole female", "solo action", "spanking", "speculum", "spider", "spider girl", "squid girl","squirrel girl", "squirting", "ssbbw", "stewardess", "stirrup legwear", "stockings", "stomach deformation", "straitjacket", "strap-on", "stretching", "stuck in wall", "sumata", "sundress", "sunglasses", "sweating", "swimsuit", "swinging", "syringe", "tabi socks", "table masturbation", "tail", "tail plug", "tailjob", "tailphagia", "tall girl", "tanlines", "teacher", "tentacles", "thick eyebrows", "thigh high boots", "tiara", "tickling", "tiger", "tights", "toddlercon", "tomboy", "tooth brushing", "torture", "tracksuit", "trampling", "transformation", "transparent clothing", "tribadism", "triple anal", "triple penetration", "triple vaginal", "ttf threesome", "ttt threesome", "tube", "turtle", "tutor", "twins", "twintails", "unbirth", "underwater", "unicorn", "unusual insertions", "unusual pupils", "unusual teeth", "urethra insertion", "urination", "vacbed", "vaginal birth", "vaginal sticker", "vampire", "very long hair", "vomit", "vore", "voyeurism", "vtuber", "waiter", "waitress", "weight gain", "wet clothes", "whale", "whip", "widow", "wingjob", "wings", "witch", "wolf", "wolf girl", "wooden horse", "worm", "wormhole", "wrestling", "x-ray", "yandere", "yuri", "zebra", "zombie"],
            "language": ["english", "japanese", "chinese", "german", "dutch", "french", "finnish", "turkish", "polish", "greek", "korean", "ukrainian", "russian"],
            "mixed": ["group", "ffm threesome", "incest", "mmf threesome", "kodomo doushi", "frottage", "body swap", "animal on animal", "gang rape", "inseki", "low incest", "mmt threesome", "mtf threesome", "multimouth blowjob", "multiple assjob", "multiple footjob", "multiple handjob", "nudism", "ttm threesome", "twins"],
            "other": ["comic", "sketch lines", "full color", "sample", "no penetration", "novel", "story arc", "western cg", "uncensored", "multi-work series", "3d", "watermarked", "3d imageset", "already uploaded", "compilation", "ai generated", "caption", "mosaic censorship", "incomplete", "western imageset", "western non-h", "out of order", "animated", "anthology", "artbook", "defaced", "forbidden content", "anaglyph", "extraneous ads", "figure", "full censorship", "game sprite", "hardcore", "how to", "missing cover", "multipanel sequence", "non-h game manual", "non-nude", "non-h imageset", "nudity only", "object insertion only", "onsen", "paperchild", "realporn", "redraw", "replaced", "rough grammer", "rough translation", "scanmark", "screenshots", "time stop", "themeless", "variant set", "webtoon"]
        };
        const checkboxes = {};
        let selectedTagsContainer;
        function syncFromSearchInput() {
            let currentQuery = (searchInput.value || "").trim();
            let savedTags = JSON.parse(localStorage.getItem("selectedTags")) || [];
            let savedQuery = savedTags.join(" ").trim();

            // Check if we are on a tag page (e.g. /tag/female:anal)
            if (currentQuery === "" && window.location.pathname.startsWith("/tag/")) {
                let pathParts = window.location.pathname.split('/tag/')[1].split(':');
                if (pathParts.length === 2) {
                    let category = pathParts[0];
                    let tag = pathParts[1];
                    currentQuery = `${category}:${tag}`;
                }
            }

            if (currentQuery !== savedQuery) {
                Object.keys(checkboxes).forEach(key => {
                    let checkbox = checkboxes[key];
                    let negativeCheckbox = checkbox.nextSibling;
                    checkbox.checked = false;
                    negativeCheckbox.checked = false;

                    localStorage.removeItem(checkbox.dataset.category + ":" + checkbox.value);
                    localStorage.removeItem("negative:" + checkbox.dataset.category + ":" + checkbox.value);
                });

                if (currentQuery !== "") {
                    let tagStrings = currentQuery.split(/\s+/); // Split by spaces to get tags
                    tagStrings.forEach(tagStr => {
                        let isNegative = tagStr.startsWith("-");
                        let cleaned = tagStr.replace("-", "");
                        let [category, ...tagParts] = cleaned.split(":");
                        let tags = tagParts.join(":").split(","); // handle multiple tags in a category

                        tags.forEach(tag => {
                            let key = `${category}:${tag}`;
                            if (checkboxes[key]) {
                                if (isNegative) {
                                    checkboxes[key].nextSibling.checked = true;
                                    localStorage.setItem("negative:" + category + ":" + tag, "true");
                                } else {
                                    checkboxes[key].checked = true;
                                    localStorage.setItem(category + ":" + tag, "true");
                                }
                            }
                        });
                    });

                    localStorage.setItem("selectedTags", JSON.stringify(tagStrings));
                } else {
                    localStorage.removeItem("selectedTags");
                }

                updateSearchInput();
            }
        }

        function isRealMobile() {
            const ua = navigator.userAgent || "";
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
        }


        // UI panel
        const panel = document.createElement("div");
        panel.style.position = "fixed";
        panel.style.background = "#282c34";
        panel.style.color = "white";
        panel.style.padding = "12px";
        panel.style.borderRadius = "12px";
        panel.style.boxShadow = "0px 5px 15px rgba(0, 0, 0, 0.6)";
        panel.style.zIndex = "9999";
        panel.style.fontSize = "12px";
        panel.style.display = "flex";
        panel.style.flexDirection = "column";
        panel.style.transition = "all 0.3s ease";

        const searchBox = document.createElement("input");
        searchBox.type = "text";
        searchBox.placeholder = "Search tags...";
        searchBox.style.marginBottom = "12px";
        searchBox.style.padding = "10px";
        searchBox.style.fontSize = "12px";
        searchBox.style.border = "none";
        searchBox.style.borderRadius = "8px";
        searchBox.style.background = "#444";
        searchBox.style.color = "white";
        panel.appendChild(searchBox);

        const scrollContainer = document.createElement("div");
        function updateScrollContainerHeight() {
            const vh = window.innerHeight;
            const available = vh - 250;

            scrollContainer.style.maxHeight = available > 200 ? `${available}px` : "200px";
            scrollContainer.style.overflowY = "auto";
        }

        updateScrollContainerHeight();
        window.addEventListener("resize", updateScrollContainerHeight);
        scrollContainer.style.overflowY = "auto";
        scrollContainer.style.padding = "5px";
        scrollContainer.style.borderRadius = "8px";
        scrollContainer.style.background = "#333";
        scrollContainer.style.marginBottom = "12px";

Object.keys(tags).forEach(category => {
    const catTitle = document.createElement("div");
    catTitle.innerText = category.toUpperCase();
    catTitle.style.fontWeight = "bold";
    catTitle.style.marginTop = "12px";
    catTitle.style.marginBottom = "5px";
    catTitle.style.padding = "6px";
    catTitle.style.background = "#444";
    catTitle.style.borderRadius = "6px";
    catTitle.style.textAlign = "center";
    catTitle.style.fontSize = "13px";
    catTitle.style.cursor = "pointer";
    catTitle.style.userSelect = "none";

    let isVisible = true;
    catTitle.addEventListener("click", function () {
        isVisible = !isVisible;
        localStorage.setItem(`${category}-collapsed`, isVisible ? "false" : "true");
        tagContainer.style.display = isVisible ? "grid" : "none";
    });
    scrollContainer.appendChild(catTitle);

    const tagContainer = document.createElement("div");
    tagContainer.style.display = "grid";
    tagContainer.style.gap = "6px";

    tags[category].sort().forEach(tag => {
        const label = document.createElement("label");
        label.style.display = "flex";
        label.style.alignItems = "center";
        label.style.padding = "8px";
        label.style.borderRadius = "6px";
        label.style.cursor = "pointer";
        label.style.transition = "background 0.2s ease-in-out";
        label.style.background = "#222234";

        label.onmouseover = () => (label.style.background = "#44446b");
        label.onmouseout = () => (label.style.background = "#222234");

        // Create the pin button
        const pinBtn = document.createElement("button");
        pinBtn.classList.add("pin-btn");
        pinBtn.innerText = "☆";
        pinBtn.style.fontSize = "10px";
        pinBtn.style.padding = "4px 8px";
        pinBtn.style.border = "none";
        pinBtn.style.borderRadius = "8px";
        pinBtn.style.backgroundColor = "#716c63";
        pinBtn.style.color = "white";
        pinBtn.style.cursor = "pointer";
        pinBtn.style.marginLeft = "8px";

        // Check if this tag is pinned and update the button's style accordingly
        if (localStorage.getItem(`pinned:${category}:${tag}`)) {
            pinBtn.style.backgroundColor = "#2ecc71";
            pinBtn.innerText = "⭐";
        }

        pinBtn.addEventListener("click", () => {
            const pinKey = `pinned:${category}:${tag}`;
            const isPinned = localStorage.getItem(pinKey);

            if (isPinned) {
                localStorage.removeItem(pinKey);
                pinBtn.style.backgroundColor = "#716c63";
                pinBtn.innerText = "☆";
            } else {
                localStorage.setItem(pinKey, "true");
                pinBtn.style.backgroundColor = "#2ecc71";
                pinBtn.innerText = "⭐";
            }

            updatePinnedTags();
        });

        label.appendChild(pinBtn);

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = tag;
        checkbox.dataset.category = category;
        checkboxes[category + ":" + tag] = checkbox;

        const negativeCheckbox = document.createElement("input");
        negativeCheckbox.type = "checkbox";
        negativeCheckbox.style.marginLeft = "10px";

        if (localStorage.getItem(category + ":" + tag) === "true") {
            checkbox.checked = true;
        }
        if (localStorage.getItem("negative:" + category + ":" + tag) === "true") {
            negativeCheckbox.checked = true;
        }

        label.appendChild(checkbox);
        label.appendChild(negativeCheckbox);

        const text = document.createElement("span");
        text.innerText = " " + tag;
        text.style.marginLeft = "8px";
        text.style.fontSize = "13px";
        label.appendChild(text);

        tagContainer.appendChild(label);

        checkbox.addEventListener("change", () => {
            localStorage.setItem(category + ":" + tag, checkbox.checked);
            updateSearchInput();
        });

        negativeCheckbox.addEventListener("change", () => {
            localStorage.setItem("negative:" + category + ":" + tag, negativeCheckbox.checked);
            updateSearchInput();
        });
    });

    scrollContainer.appendChild(tagContainer);
});


        panel.appendChild(scrollContainer);

        selectedTagsContainer = document.createElement("div");
        selectedTagsContainer.style.maxHeight = "80px";
        selectedTagsContainer.style.overflowY = "auto";
        selectedTagsContainer.style.padding = "8px";
        selectedTagsContainer.style.background = "#2b2b3a";
        selectedTagsContainer.style.borderRadius = "8px";
        selectedTagsContainer.style.marginBottom = "10px";
        panel.appendChild(selectedTagsContainer);

        const buttonsContainer = document.createElement("div");
        buttonsContainer.style.display = "flex";
        buttonsContainer.style.justifyContent = "space-between";
        buttonsContainer.style.marginTop = "10px";
        buttonsContainer.style.width = "100%";
        const clearBtn = document.createElement("button");
        clearBtn.innerText = "Clear All";
        clearBtn.style.marginTop = "10px";
        clearBtn.style.width = "100%";
        clearBtn.style.background = "#d9534f";
        clearBtn.style.padding = "10px";
        clearBtn.style.cursor = "pointer";
        clearBtn.style.fontWeight = "bold";

        clearBtn.onmouseover = () => (clearBtn.style.background = "#c9302c");
        clearBtn.onmouseout = () => (clearBtn.style.background = "#d9534f");

        clearBtn.addEventListener("click", () => {
            Object.keys(checkboxes).forEach(key => {
                let checkbox = checkboxes[key];
                let negativeCheckbox = checkbox.nextSibling;
                checkbox.checked = false;
                negativeCheckbox.checked = false;
                localStorage.removeItem(checkbox.dataset.category + ":" + checkbox.value);
                localStorage.removeItem("negative:" + checkbox.dataset.category + ":" + checkbox.value);
            });
            localStorage.removeItem("selectedTags");
            updateSearchInput();
        });

        const applyBtn = document.createElement("button");
        applyBtn.innerText = "Apply Search";
        applyBtn.style.marginTop = "10px";
        applyBtn.style.width = "100%";
        applyBtn.style.background = "#5cb85c";
        applyBtn.style.padding = "10px";
        applyBtn.style.cursor = "pointer";
        applyBtn.style.fontWeight = "bold";

        applyBtn.onmouseover = () => (applyBtn.style.background = "#4cae4c");
        applyBtn.onmouseout = () => (applyBtn.style.background = "#5cb85c");

        applyBtn.addEventListener("click", () => {
            updateSearchInput();
            const form = searchInput.closest("form");
            if (form) form.submit();
        });

        buttonsContainer.appendChild(clearBtn);
        buttonsContainer.appendChild(applyBtn);
        panel.appendChild(buttonsContainer);

        document.body.appendChild(panel);
        console.log("Panel appended");



        function updateSearchInput() {
            let selectedTags = {};
            let negativeTags = {};
            let selectedTagsText = [];


            Object.keys(checkboxes).forEach(key => {
                let checkbox = checkboxes[key];
                let category = checkbox.dataset.category;
                let tag = checkbox.value;
                let negativeCheckbox = checkbox.nextSibling;

                if (!selectedTags[category]) selectedTags[category] = [];
                if (!negativeTags[category]) negativeTags[category] = [];

                if (checkbox.checked) {
                    selectedTags[category].push(tag);
                    selectedTagsText.push(`${category}:${tag}`);
                }
                if (negativeCheckbox && negativeCheckbox.checked) {
                    negativeTags[category].push(tag);
                    selectedTagsText.push(`-${category}:${tag}`);
                }
            });

            localStorage.setItem("selectedTags", JSON.stringify(selectedTagsText));

            let queryParts = [];
            Object.keys(selectedTags).forEach(category => {
                if (selectedTags[category].length > 0) {
                    queryParts.push(`${category}:${selectedTags[category].join(",")}`);
                }
            });
            Object.keys(negativeTags).forEach(category => {
                if (negativeTags[category].length > 0) {
                    queryParts.push(`-${category}:${negativeTags[category].join(",")}`);
                }
            });

            selectedTagsContainer.innerHTML = selectedTagsText.length > 0 ? selectedTagsText.join(", ") : "No tags selected";
            searchInput.value = queryParts.join(" ");
            searchInput.dispatchEvent(new Event('input', { bubbles: true }));
        }

        // Filter tags by search
        searchBox.addEventListener("input", () => {
            let filterText = searchBox.value.toLowerCase();
            Object.values(checkboxes).forEach(checkbox => {
                let label = checkbox.parentNode;
                let tagText = label.textContent.toLowerCase();
                label.style.display = tagText.includes(filterText) ? "flex" : "none";
            });
        });
        const bookmarkLabel = document.createElement("label");
        bookmarkLabel.innerText = "Bookmarks:";
        bookmarkLabel.style.marginTop = "10px";
        bookmarkLabel.style.marginBottom = "5px";
        panel.appendChild(bookmarkLabel);

        const bookmarkSelect = document.createElement("select");
        bookmarkSelect.style.width = "100%";
        bookmarkSelect.style.marginBottom = "8px";
        bookmarkSelect.style.padding = "8px";
        bookmarkSelect.style.borderRadius = "6px";
        bookmarkSelect.style.border = "none";
        bookmarkSelect.style.background = "#444";
        bookmarkSelect.style.color = "white";

        panel.appendChild(bookmarkSelect);

        const bookmarkSaveBtn = document.createElement("button");
        bookmarkSaveBtn.innerText = "Save Bookmark";
        bookmarkSaveBtn.style.marginBottom = "6px";
        bookmarkSaveBtn.style.width = "100%";
        bookmarkSaveBtn.style.background = "#337ab7";
        bookmarkSaveBtn.style.color = "white";
        bookmarkSaveBtn.style.border = "none";
        bookmarkSaveBtn.style.padding = "8px";
        bookmarkSaveBtn.style.borderRadius = "6px";
        bookmarkSaveBtn.style.cursor = "pointer";

        bookmarkSaveBtn.addEventListener("click", () => {
            const name = prompt("Enter a name for this bookmark:");
            if (!name) return;
            let bookmarks = {};
            try {
                bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || {};
            } catch (e) {
                bookmarks = {};
            }
            bookmarks[name] = searchInput.value.trim();
            localStorage.setItem("bookmarks", JSON.stringify(bookmarks));

        });

        panel.appendChild(bookmarkSaveBtn);

        const bookmarkLoadBtn = document.createElement("button");
        bookmarkLoadBtn.innerText = "Load Bookmark";
        bookmarkLoadBtn.style.marginBottom = "6px";
        bookmarkLoadBtn.style.width = "100%";
        bookmarkLoadBtn.style.background = "#5bc0de";
        bookmarkLoadBtn.style.color = "white";
        bookmarkLoadBtn.style.border = "none";
        bookmarkLoadBtn.style.padding = "8px";
        bookmarkLoadBtn.style.borderRadius = "6px";
        bookmarkLoadBtn.style.cursor = "pointer";

        bookmarkLoadBtn.addEventListener("click", () => {
            const value = bookmarkSelect.value;
            if (!value) return;
            searchInput.value = value;
            syncFromSearchInput();
          loadBookmarks();
        });

        panel.appendChild(bookmarkLoadBtn);

        const bookmarkDeleteBtn = document.createElement("button");
        bookmarkDeleteBtn.innerText = "Delete Bookmark";
        bookmarkDeleteBtn.style.marginBottom = "10px";
        bookmarkDeleteBtn.style.width = "100%";
        bookmarkDeleteBtn.style.background = "#d9534f";
        bookmarkDeleteBtn.style.color = "white";
        bookmarkDeleteBtn.style.border = "none";
        bookmarkDeleteBtn.style.padding = "8px";
        bookmarkDeleteBtn.style.borderRadius = "6px";
        bookmarkDeleteBtn.style.cursor = "pointer";

        bookmarkDeleteBtn.addEventListener("click", () => {
        const selectedOption = bookmarkSelect.options[bookmarkSelect.selectedIndex];
        if (!selectedOption) {
            alert("No bookmark selected to delete.");
            return;
        }

        const name = selectedOption.text;

        let bookmarks = {};
        try {
            bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || {};
        } catch (e) {
            bookmarks = {};
        }

        delete bookmarks[name];
        localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
        loadBookmarks();
        bookmarkSelect.selectedIndex = -1;
    });


      panel.appendChild(bookmarkDeleteBtn);
      function loadBookmarks() {
        bookmarkSelect.innerHTML = "";
        const saved = JSON.parse(localStorage.getItem("bookmarks") || "{}");
        Object.entries(saved).forEach(([name, value]) => {
            const opt = document.createElement("option");
            opt.value = value;
            opt.text = name;
            bookmarkSelect.appendChild(opt);
        });
        }
        const importBtn = document.createElement("button");
        importBtn.innerText = "Import Config";
        importBtn.style.marginTop = "6px";
        importBtn.style.width = "100%";
        importBtn.style.background = "#5bc0de";
        importBtn.style.padding = "10px";
        importBtn.style.cursor = "pointer";
        importBtn.style.fontWeight = "bold";

        const exportBtn = document.createElement("button");
        exportBtn.innerText = "Export Config";
        exportBtn.style.marginTop = "6px";
        exportBtn.style.width = "100%";
        exportBtn.style.background = "#337ab7";
        exportBtn.style.padding = "10px";
        exportBtn.style.cursor = "pointer";
        exportBtn.style.fontWeight = "bold";

        const configBtnWrapper = document.createElement("div");
        configBtnWrapper.style.display = "flex";
        configBtnWrapper.style.justifyContent = "space-between";
        configBtnWrapper.style.gap = "8px";
        configBtnWrapper.style.marginTop = "6px";

        importBtn.style.flex = "1";
        exportBtn.style.flex = "1";
        importBtn.style.marginTop = "0";
        exportBtn.style.marginTop = "0";

        configBtnWrapper.appendChild(importBtn);
        configBtnWrapper.appendChild(exportBtn);
        panel.appendChild(configBtnWrapper);
        exportBtn.addEventListener("click", () => {
            let pinnedTags = [];
            for (let i = 0; i < localStorage.length; i++) {
                let key = localStorage.key(i);
                if (key.startsWith("pinned:")) {
                    pinnedTags.push(key.replace("pinned:", ""));
                }
            }

            const config = {
                selectedTags: JSON.parse(localStorage.getItem("selectedTags")) || [],
                pinnedTags: pinnedTags,
                bookmarks: JSON.parse(localStorage.getItem("bookmarks")) || {},
            };


            const configJSON = JSON.stringify(config);
            const blob = new Blob([configJSON], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "config.json";
            link.click();
        });

        function updatePanelLayout() {
        if (!panel) return;

        if (isRealMobile()) {
            panel.querySelectorAll("button, select, label, input, span").forEach(el => {
                el.style.fontSize = "26px";
                el.style.padding = "5px";
            });
            panel.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                cb.style.transform = "scale(1.6)";
                cb.style.marginRight = "10px";
                cb.style.marginLeft = "10px";
                cb.style.cursor = "pointer";
            });
            panel.style.top = "auto";
            panel.style.bottom = "0";
            panel.style.left = "0";
            panel.style.width = "100%";
            panel.style.height = "35vh";
            panel.style.paddingBottom = "env(safe-area-inset-bottom)";
            document.body.style.paddingBottom = "35vh";
            panel.style.borderRadius = "12px 12px 0 0";
            panel.style.position = "fixed";
            bookmarkLabel.style.display = "none";
            bookmarkSelect.style.display = "none";
            bookmarkSaveBtn.style.display = "none";
            bookmarkLoadBtn.style.display = "none";
            bookmarkDeleteBtn.style.display = "none";
        } else {
            panel.style.top = "50px";
            panel.style.right = "10px";
            panel.style.width = "300px";
            panel.style.height = "900px";
            panel.style.borderRadius = "12px";
            panel.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                cb.style.transform = "scale(1)";
                cb.style.marginRight = "4px";
            });
        }
    }

      if (!document.body.contains(panel)) {
          document.body.appendChild(panel);
      }
      updatePanelLayout();

      window.addEventListener('pageshow', updatePanelLayout);

        window.addEventListener("resize", updatePanelLayout);
        window.addEventListener("orientationchange", updatePanelLayout);
        window.addEventListener("load", updatePanelLayout);

        console.log("UA:", navigator.userAgent);
        try {
          localStorage.setItem("__test__", "1");
          localStorage.removeItem("__test__");
          console.log("localStorage works ✅");
        } catch (e) {
          console.warn("localStorage not supported ❌", e);
        }



        importBtn.addEventListener("click", () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";
        input.click();

        input.addEventListener("change", function () {
            const file = input.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (event) {
                    try {
                        const config = JSON.parse(event.target.result);

                        // Restore selected tags
                        localStorage.setItem("selectedTags", JSON.stringify(config.selectedTags));
                        config.selectedTags.forEach(tag => {
    					const isNegative = tag.startsWith("-");
    					const cleanedTag = isNegative ? tag.slice(1) : tag;
    					const [category, ...tagParts] = cleanedTag.split(":");
    					const tagName = tagParts.join(":");
    					const checkbox = checkboxes[category + ":" + tagName];
    					if (checkbox) {
        					if (isNegative) {
            					checkbox.nextSibling.checked = true;
            					localStorage.setItem("negative:" + category + ":" + tagName, "true");
        					} else {
            					checkbox.checked = true;
            					localStorage.setItem(category + ":" + tagName, "true");
        					}
    					}
					});


                        // Restore pinned tags
                        if (config.pinnedTags) {
                            config.pinnedTags.forEach(tag => {
                                const [category, ...tagParts] = tag.split(":");
                                const tagName = tagParts.join(":");
                                const pinKey = `pinned:${category}:${tagName}`;
                                localStorage.setItem(pinKey, "true");
                                const checkbox = checkboxes[category + ":" + tagName];
                                if (checkbox) {
                                    const pinBtn = checkbox.parentNode.querySelector(".pin-btn");
                                    if (pinBtn) {
                                        pinBtn.style.backgroundColor = "#2ecc71";
                                        pinBtn.innerText = "⭐";
                                    }
                                }
                            });
                        }

                        // Restore bookmarks
                        localStorage.setItem("bookmarks", JSON.stringify(config.bookmarks));

                        alert("Configuration imported successfully!");
                    } catch (error) {
                        alert("Failed to import configuration. Please ensure the file is valid.");
                    }
                };
                reader.readAsText(file);
            }
        });
    });

        syncFromSearchInput();
        window.addEventListener("popstate", syncFromSearchInput);
        loadBookmarks();
    });
})();

