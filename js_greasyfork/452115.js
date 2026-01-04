// ==UserScript==
// @name         MouseHunt - Folklore Forest Map color Coder
// @author       in59te
// @namespace    https://greasyfork.org/en/users/739524-in59te
// @version      0.9
// @description  color codes mice on Folklore Forest maps according to type
// @match        http://www.mousehuntgame.com/*
// @match        https://www.mousehuntgame.com/*
// Based off original script by Tsitu
// @downloadURL https://update.greasyfork.org/scripts/452115/MouseHunt%20-%20Folklore%20Forest%20Map%20color%20Coder.user.js
// @updateURL https://update.greasyfork.org/scripts/452115/MouseHunt%20-%20Folklore%20Forest%20Map%20color%20Coder.meta.js
// ==/UserScript==
    
    const SeedMice = [
        "Root Rummager",
        "Grit Grifter",
    ];
    const FarmSpecialMice = [
        "Land Loafer",
        "Loathsome Locust",
        "Monstrous Midge"
    ];
    const PestsMice = [
        "Angry Aphid",
        "Wily Weevil",
        "Mighty Mite"
    ];
    const StandardPondMice = [
        "Beachcomber",
        "Sand Sifter",
        "Tackle Tracker"
    ];
    const GrubMice = [
        "Pompous Perch",
        "Careless Catfish",
        "Melodramatic Minnow"
    ];
    const ClamMice = [
        "Sinister Squid",
        "Nefarious Nautilus",
        "Vicious Vampire Squid"
    ];
    const StormyMice = [
        "Architeuthulhu of the Abyss"
    ];
    const StandardNonWritingMice = [
        "Brothers Grimmaus",
        "Hans Cheesetian Squeakersen",
        "Madame d'Ormouse",
    ];
    const StandardWritingMice = [
        "Humphrey Dumphrey",
        "Little Bo Squeak",
        "Little Miss Fluffet"
    ];
    const SBOnlyMice = [
        "Crazed Cultivator",
        "Matriarch Gander",
        "Covetous Coastguard"
    ];
    const FirstDDMice = [
        "Fibbocchio",
        "Pinkielina",
        "Princess and the Olive"
    ];
    const SecondDDMice = [
        "Flamboyant Flautist",
        "Greenbeard",
        "Ice Regent"
    ];
    const FinalDDMice = [
        "Bitter Grammarian",
        "Mythweaver"
    ];
    
    
    function colorize() {
    let SBOnlycolor = "#FFFFFF"; // white
    let SBOnlyCount = 0;
    let Seedcolor = "#0FF380"; // light green
    let SeedCount = 0;
    let Pestscolor = "#0EA635"; // med green
    let PestsCount = 0;
    let FarmSpecialcolor = "#0B6222"; // dark green
    let FarmSpecialCount = 0;
    let StandardPondcolor = "#5BF8DC"; // light blue
    let StandardPondCount = 0;
    let Grubcolor = "#0F97F7"; // normal blue
    let GrubCount = 0;
    let Clamcolor = "#07568C"; // dark blue
    let ClamCount = 0;
    let Stormycolor = "#8428CC"; // some shade of purple
    let StormyCount = 0;
    let StandardWritingcolor = "#FC5E78"; // cherry
    let StandardWritingCount = 0;
    let StandardNonWritingcolor = "#CDCDCD"; // grey
    let StandardNonWritingCount = 0;
    let FirstDDcolor = "#FDFAA2"; // yellow
    let FirstDDCount = 0;
    let SecondDDcolor = "#F8943A"; // orange
    let SecondDDCount = 0;
    let FinalDDcolor = "#D6A80B"; // gold
    let FinalDDCount = 0;
    const greycolor = "#949494";
    
    const isChecked =
        localStorage.getItem("highlightPref") === "uncaught-only" ? true : false;
    const isCheckedStr = isChecked ? "checked" : "";
    
    if (
        document.querySelectorAll(".treasureMapView-goals-group-goal").length === 0
    ) {
        return;
    }
    
    document.querySelectorAll(".treasureMapView-goals-group-goal").forEach(el => {
        el.querySelector("span").style = "color: black; font-size: 11px;";
    
        const mouseName = el.querySelector(".treasureMapView-goals-group-goal-name")
        .textContent;
    
        if (SeedMice.indexOf(mouseName) > -1) {
        el.style.backgroundColor = Seedcolor;
        if (el.className.indexOf(" complete ") < 0) {
            SeedCount++;
        } else {
            if (isChecked) el.style.backgroundColor = "white";
        }
        } else if (FarmSpecialMice.indexOf(mouseName) > -1) {
        el.style.backgroundColor = FarmSpecialcolor;
        if (el.className.indexOf(" complete ") < 0) {
            FarmSpecialCount++;
        } else {
            if (isChecked) el.style.backgroundColor = "white";
        }
        } else if (PestsMice.indexOf(mouseName) > -1) {
        el.style.backgroundColor = Pestscolor;
        if (el.className.indexOf(" complete ") < 0) {
            PestsCount++;
        } else {
            if (isChecked) el.style.backgroundColor = "white";
        }
        } else if (StandardPondMice.indexOf(mouseName) > -1) {
        el.style.backgroundColor = StandardPondcolor;
        if (el.className.indexOf(" complete ") < 0) {
            StandardPondCount++;
        } else {
            if (isChecked) el.style.backgroundColor = "white";
        }
        } else if (GrubMice.indexOf(mouseName) > -1) {
        el.style.backgroundColor = Grubcolor;
        if (el.className.indexOf(" complete ") < 0) {
            GrubCount++;
        } else {
            if (isChecked) el.style.backgroundColor = "white";
        }
        } else if (ClamMice.indexOf(mouseName) > -1) {
        el.style.backgroundColor = Clamcolor;
        if (el.className.indexOf(" complete ") < 0) {
            ClamCount++;
        } else {
            if (isChecked) el.style.backgroundColor = "white";
        }
        } else if (StormyMice.indexOf(mouseName) > -1) {
        el.style.backgroundColor = Stormycolor;
        if (el.className.indexOf(" complete ") < 0) {
            StormyCount++;
        } else {
            if (isChecked) el.style.backgroundColor = "white";
        }
        } else if (StandardNonWritingMice.indexOf(mouseName) > -1) {
        el.style.backgroundColor = StandardNonWritingcolor;
        if (el.className.indexOf(" complete ") < 0) {
            StandardNonWritingCount++;
        } else {
            if (isChecked) el.style.backgroundColor = "white";
        }
        } else if (StandardWritingMice.indexOf(mouseName) > -1) {
        el.style.backgroundColor = StandardWritingcolor;
        if (el.className.indexOf(" complete ") < 0) {
            StandardWritingCount++;
        } else {
            if (isChecked) el.style.backgroundColor = "white";
        }
        } else if (SBOnlyMice.indexOf(mouseName) > -1) {
        el.style.backgroundColor = SBOnlycolor;
        if (el.className.indexOf(" complete ") < 0) {
            SBOnlyCount++;
        } else {
            if (isChecked) el.style.backgroundColor = "white";
        }
        } else if (FirstDDMice.indexOf(mouseName) > -1) {
        el.style.backgroundColor = FirstDDcolor;
        if (el.className.indexOf(" complete ") < 0) {
            FirstDDCount++;
        } else {
            if (isChecked) el.style.backgroundColor = "white";
        } 
        } else if (SecondDDMice.indexOf(mouseName) > -1) {
            el.style.backgroundColor = SecondDDcolor;
            if (el.className.indexOf(" complete ") < 0) {
                SecondDDCount++;
            } else {
                if (isChecked) el.style.backgroundColor = "white";
            }
        } else if (FinalDDMice.indexOf(mouseName) > -1) {
            el.style.backgroundColor = FinalDDcolor;
            if (el.className.indexOf(" complete ") < 0) {
                FinalDDCount++;
            } else {
                if (isChecked) el.style.backgroundColor = "white";
            }
        }
    });
    
    Seedcolor = SeedCount > 0 ? Seedcolor : greycolor;
    FarmSpecialcolor = FarmSpecialCount > 0 ? FarmSpecialcolor : greycolor;
    Pestscolor = PestsCount > 0 ? Pestscolor : greycolor;
    StandardPondcolor = StandardPondCount > 0 ? StandardPondcolor : greycolor;
    Grubcolor = GrubCount > 0 ? Grubcolor : greycolor;
    Clamcolor = ClamCount > 0 ? Clamcolor : greycolor;
    Stormycolor = StormyCount > 0 ? Stormycolor : greycolor;
    StandardNonWritingcolor = StandardNonWritingCount > 0 ? StandardNonWritingcolor : greycolor;
    StandardWritingcolor = StandardWritingCount > 0 ? StandardWritingcolor : greycolor;
    SBOnlycolor = SBOnlyCount > 0 ? SBOnlycolor : greycolor;
    FirstDDcolor = FirstDDCount > 0 ? FirstDDcolor : greycolor;
    SecondDDcolor = SecondDDCount > 0 ? SecondDDcolor : greycolor;
    FinalDDcolor = FinalDDCount > 0 ? FinalDDcolor : greycolor;
    
    // Remove existing GWH Map related elements before proceeding
    document.querySelectorAll(".ff-map").forEach(el => el.remove());
    
    const masterDiv = document.createElement("div");
    masterDiv.className = "ff-map";
    masterDiv.style =
        "display: inline-flex; margin-bottom: 10px; width: 100%; text-align: center; line-height: 1.5; overflow: hidden";
    const spanStyle =
        "; width: auto; padding: 5px; font-weight: bold; font-size: 10px; text-shadow: 0px 0px 11px white";
    
    const SeedSpan = document.createElement("span");
    SeedSpan.style = "background-color: " + Seedcolor + spanStyle;
    SeedSpan.innerHTML = "Seed<br>" + SeedCount;
    
    const FarmSpecialSpan = document.createElement("span");
    FarmSpecialSpan.style = "background-color: " + FarmSpecialcolor + spanStyle;
    FarmSpecialSpan.innerHTML = "Farm Spec<br>" + FarmSpecialCount;
    
    const PestsSpan = document.createElement("span");
    PestsSpan.style = "background-color: " + Pestscolor + spanStyle;
    PestsSpan.innerHTML = "Pest<br>" + PestsCount;
    
    const StandardPondSpan = document.createElement("span");
    StandardPondSpan.style = "background-color: " + StandardPondcolor + spanStyle;
    StandardPondSpan.innerHTML = "Pd Std<br>" + StandardPondCount;
    
    const GrubSpan = document.createElement("span");
    GrubSpan.style = "background-color: " + Grubcolor + spanStyle;
    GrubSpan.innerHTML = "Grub<br>" + GrubCount;
    
    const ClamSpan = document.createElement("span");
    ClamSpan.style = "background-color: " + Clamcolor + spanStyle;
    ClamSpan.innerHTML = "Clam<br>" + ClamCount;
    
    const StormySpan = document.createElement("span");
    StormySpan.style = "background-color: " + Stormycolor + spanStyle;
    StormySpan.innerHTML = "Storm<br>" + StormyCount;
    
    const StandardNonWritingSpan = document.createElement("span");
    StandardNonWritingSpan.style = "background-color: " + StandardNonWritingcolor + spanStyle;
    StandardNonWritingSpan.innerHTML = "Std w/o write<br>" + StandardNonWritingCount;
    
    const StandardWritingSpan = document.createElement("span");
    StandardWritingSpan.style = "background-color: " + StandardWritingcolor + spanStyle;
    StandardWritingSpan.innerHTML = "Std w write<br>" + StandardWritingCount;
    
    const SBOnlySpan = document.createElement("span");
    SBOnlySpan.style = "background-color: " + SBOnlycolor + spanStyle;
    SBOnlySpan.innerHTML = "SB Only<br>" + SBOnlyCount;
    
    const FirstDDSpan = document.createElement("span");
    FirstDDSpan.style = "background-color: " + FirstDDcolor + spanStyle;
    FirstDDSpan.innerHTML = "1DD<br>" + FirstDDCount;

    const SecondDDSpan = document.createElement("span");
    SecondDDSpan.style = "background-color: " + SecondDDcolor + spanStyle;
    SecondDDSpan.innerHTML = "2DD<br>" + SecondDDCount;

    const FinalDDSpan = document.createElement("span");
    FinalDDSpan.style = "background-color: " + FinalDDcolor + spanStyle;
    FinalDDSpan.innerHTML = "FDD<br>" + FinalDDCount;
    
    // Highlight uncaught only feature
    const highlightLabel = document.createElement("label");
    highlightLabel.htmlFor = "tsitu-highlight-box";
    highlightLabel.innerText = "Highlight uncaught mice only";
    
    const highlightBox = document.createElement("input");
    highlightBox.type = "checkbox";
    highlightBox.name = "tsitu-highlight-box";
    highlightBox.style.verticalAlign = "middle";
    highlightBox.checked = isChecked;
    highlightBox.addEventListener("click", function () {
        if (highlightBox.checked) {
        localStorage.setItem("highlightPref", "uncaught-only");
        } else {
        localStorage.setItem("highlightPref", "all");
        }
        colorize();
    });
    
    const highlightDiv = document.createElement("div");
    highlightDiv.className = "ff-map";
    highlightDiv.style = "float: right; position: relative; z-index: 1";
    highlightDiv.appendChild(highlightBox);
    highlightDiv.appendChild(highlightLabel);
    
    // Assemble masterDiv
    masterDiv.appendChild(SBOnlySpan);
    masterDiv.appendChild(SeedSpan);
    masterDiv.appendChild(PestsSpan);
    masterDiv.appendChild(FarmSpecialSpan);
    masterDiv.appendChild(StandardPondSpan);
    masterDiv.appendChild(GrubSpan);
    masterDiv.appendChild(ClamSpan);
    masterDiv.appendChild(StormySpan);
    masterDiv.appendChild(StandardNonWritingSpan);
    masterDiv.appendChild(StandardWritingSpan);
    masterDiv.appendChild(FirstDDSpan);
    masterDiv.appendChild(SecondDDSpan);
    masterDiv.appendChild(FinalDDSpan);
    
    // Inject into DOM
    const insertEl = document.querySelector(
        ".treasureMapView-leftBlock .treasureMapView-block-content"
    );
    if (
        insertEl &&
        document.querySelector(
        ".treasureMapRootView-header-navigation-item.tasks.active" // On "Active Maps"
        )
    ) {
        insertEl.insertAdjacentElement("afterbegin", highlightDiv);
        insertEl.insertAdjacentElement("afterbegin", masterDiv);
    }
    
    // "Goals" button
    document.querySelector("[data-type='show_goals']").onclick = function () {
        colorize();
    };
    }
    
    // Listen to XHRs, opening a map always at least triggers board.php
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function () {
    this.addEventListener("load", function () {
        const chestEl = document.querySelector(
        ".treasureMapView-mapMenu-rewardName"
        );
    
        // Add in FF map names here
        if (chestEl) {
        const chestName = chestEl.textContent;
        if (
            chestName &&
            (chestName.indexOf("Farming and Fishing Treasure Chest") >= 0) || (chestName.indexOf("Folklore Forest Prelude Treasure Chest") >= 0)
        ) {
            colorize();
        }
        }
    });
    originalOpen.apply(this, arguments);
    };

