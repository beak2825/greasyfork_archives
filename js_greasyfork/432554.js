// ==UserScript==
// @name         Prosperous Universe Commodity Exchange Scraper
// @namespace    lorddirt
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @version      1.0.1
// @description  Collects commodity exchange data in JSON format
// @author       Lorddirt
// @match        https://apex.prosperousuniverse.com/
// @icon         https://www.google.com/s2/favicons?domain=prosperousuniverse.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432554/Prosperous%20Universe%20Commodity%20Exchange%20Scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/432554/Prosperous%20Universe%20Commodity%20Exchange%20Scraper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var prices = {};

    var GUI = setInterval(function(){
        var btn = document.createElement("BUTTON");
        btn.style.padding = 0;
        btn.style.outline = "none";
        btn.style.border = "none";
        btn.style.background = "none";

        btn.style.marginRight = "20px";

        btn.style.color = "#9da0a2";
        btn.style.backgroundColor = "#1b252b";

        btn.addEventListener('mouseenter', e => {
            btn.style.color = "#d2ddd2";
        });
        btn.addEventListener('mouseleave', e => {
            btn.style.color = "#9da0a2";
        });

        btn.textContent = "Scrape Data";
        btn.onclick = function(){
            setTimeout(function(){
                btn.textContent = ".";
                setTimeout(function(){
                    btn.textContent = "..";
                    setTimeout(function(){
                        btn.textContent = "...";
                        setTimeout(function(){
                            scrape();
                            btn.textContent = "Copied! [" + checkCategories() + "/33]";
                            setTimeout(function(){
                                btn.textContent = "Scrape Data";
                            }, 1000);
                        }, 500);
                    }, 500);
                }, 500);
            }, 500);
        };
        if(document.getElementsByTagName("select").length == 1){
            document.getElementsByTagName("select")[0].parentElement.insertBefore(btn, document.getElementsByTagName("select")[0]);
            clearInterval(GUI);
        }
    }, 1000);

    function checkCategories(){
        var foundCategories = 0;
        if("All-Purpose Fodder" in prices){
            document.getElementsByTagName("select")[0].children[0].style.color = "green";
            foundCategories += 1;
        }
        if("Ferrominium" in prices){
            document.getElementsByTagName("select")[0].children[1].style.color = "green";
            foundCategories += 1;
        }
        if("Artificial Soil" in prices){
            document.getElementsByTagName("select")[0].children[2].style.color = "green";
            foundCategories += 1;
        }
        if("Epoxy Resin" in prices){
            document.getElementsByTagName("select")[0].children[3].style.color = "green";
            foundCategories += 1;
        }
        if("Aerostat Foundation" in prices){
            document.getElementsByTagName("select")[0].children[4].style.color = "green";
            foundCategories += 1;
        }
        if("Advanced Bulkhead" in prices){
            document.getElementsByTagName("select")[0].children[5].style.color = "green";
            foundCategories += 1;
        }
        if("Drinking Water" in prices){
            document.getElementsByTagName("select")[0].children[6].style.color = "green";
            foundCategories += 1;
        }
        if("Einsteinium-Infused Gin" in prices){
            document.getElementsByTagName("select")[0].children[7].style.color = "green";
            foundCategories += 1;
        }
        if("Crowd Control Drone" in prices){
            document.getElementsByTagName("select")[0].children[8].style.color = "green";
            foundCategories += 1;
        }
        if("Antenna Array" in prices){
            document.getElementsByTagName("select")[0].children[9].style.color = "green";
            foundCategories += 1;
        }
        if("Audio Transmitter" in prices){
            document.getElementsByTagName("select")[0].children[10].style.color = "green";
            foundCategories += 1;
        }
        if("Shielded Connectors" in prices){
            document.getElementsByTagName("select")[0].children[11].style.color = "green";
            foundCategories += 1;
        }
        if("Audio Distribution System" in prices){
            document.getElementsByTagName("select")[0].children[12].style.color = "green";
            foundCategories += 1;
        }
        if("Beryllium" in prices){
            document.getElementsByTagName("select")[0].children[13].style.color = "green";
            foundCategories += 1;
        }
        if("Large Capacitor Bank" in prices){
            document.getElementsByTagName("select")[0].children[14].style.color = "green";
            foundCategories += 1;
        }
        if("FTL Fuel" in prices){
            document.getElementsByTagName("select")[0].children[15].style.color = "green";
            foundCategories += 1;
        }
        if("Ammonia" in prices){
            document.getElementsByTagName("select")[0].children[16].style.color = "green";
            foundCategories += 1;
        }
        if("Heliotrope Extract" in prices){
            document.getElementsByTagName("select")[0].children[17].style.color = "green";
            foundCategories += 1;
        }
        if("Auto-Doc" in prices){
            document.getElementsByTagName("select")[0].children[18].style.color = "green";
            foundCategories += 1;
        }
        if("Aluminium" in prices){
            document.getElementsByTagName("select")[0].children[19].style.color = "green";
            foundCategories += 1;
        }
        if("Beryl Crystals" in prices){
            document.getElementsByTagName("select")[0].children[20].style.color = "green";
            foundCategories += 1;
        }
        if("Aluminium Ore" in prices){
            document.getElementsByTagName("select")[0].children[21].style.color = "green";
            foundCategories += 1;
        }
        if("Durable Casing L" in prices){
            document.getElementsByTagName("select")[0].children[22].style.color = "green";
            foundCategories += 1;
        }
        return foundCategories;
    }

    window.scrape = function(){
        var aTags = document.getElementsByTagName("span");

        var agricultural = ["All-Purpose Fodder","Flowery Hops","Caffeinated Beans","High-Carb Grains","High-Carb Maize","Raw Cotton Fiber","Triglyceride Nuts","Triglyceride Fruits","Wine-Quality Grapes","Spicy Herbs","Hydrocarbon Plants","Meat Tissue Patties","Protein-Rich Mushrooms","Pineberries","Protein-Rich Algae","Protein-Rich Beans","Protein Paste","Raw Silk Strains","Vita Essence"];
        var alloys = ["Ferrominium", "Alpha-Stabilized Titanium", "Borosilicate", "Bronze", "Red Gold", "Blue Gold", "Ferro-Titanium", "Alpha-Stabilized Tungsten"];
        var chemicals = ["Artificial Soil", "Helpful Bacteria", "Desaturation Agent", "Breathable Liquid", "Chemical Reagents", "Cryogenic Stabilizer", "Enriched Einsteinium", "Enriched Technetium", "Flux", "Indigo Colorant", "Liquid Crystals", "Nano-Enhanced Resin", "Nutrient Solution", "Olfactory Substances", "DDT Plant Agent", "Premium Fertilizer", "Sedative Substance", "Sodium Borohydride", "TCL Acid", "ThermoFluid"];
        var constructionMaterials = ["Epoxy Resin", "InsuFoam", "MegaTube Coating", "Mineral Construction Granulate", "Nano-Carbon Sheeting", "Nano Fiber", "Nano-Coated Glass", "Reinforced Glass", "Poly-Sulfite Sealant", "Glass"];
        var constructionParts = ["Aerostat Foundation", "Air Scrubber", "Decorative Elements", "Floating Tank", "Flow Control Device", "Fluid Piping", "Cylindrical Gas Container", "Gas Vent", "Magnetic Ground Cover", "Metal-Halide Lighting System", "Neon Lighting System", "Pressure Shielding", "Radiation Shielding", "Stabilized Technetium", "Thermal Shielding", "Truss"];
        var constructionPrefabs = ["Advanced Bulkhead", "Advanced Deck Elements", "Advanced Structural Elements", "Advanced Transparent Aperture", "Basic Bulkhead", "Basic Deck Elements", "Basic Structural Elements", "Basic Transparent Aperture", "Hardened Structural Elements", "Lightweight Bulkhead", "Lightweight Deck Elements", "Lightweight Structural Elements", "Lightweight Transparent Aperture", "Reinforced Bulkhead", "Reinforced Deck Elements", "Reinforced Structural Elements", "Reinforced Transparent Aperture"];
        var basicConsumables = ["Drinking Water", "Smart Space Suit", "Flavoured Insta-Meal", "Personal Data Assistant", "Basic Overalls", "Basic Rations", "AI-Assisted Lab Coat", "Quality Meat Meal", "Scientific Work Station", "Exoskeleton Work Suit", "Power Tools", "HazMat Work Suit", "Basic Medical Kit", "Multi-Purpose Scanner"];
        var luxuryConsumables = ["Einsteinium-Infused Gin", "VitaGel", "Padded Work Overall", "Caffeinated Infusion", "Smart Zinfandel", "NeuroStimulants", "Kombucha", "Repair Kit", "Stellar Pale Ale", "Stem Cell Treatment"];
        var drones = ["Crowd Control Drone", "Drone Chassis", "Drone Frame", "Rescue Drone", "Ship-Repair Drone", "Surgical Drone", "Surveillance Drone"];
        var electronicDevices = ["Antenna Array", "Body Scanner", "Full-Body Interaction Device", "Holographic Display", "Holographic Glasses", "Basic Mainframe", "Micro Headphones", "Radio Device", "Sensor Array", "Handheld Personal Console", "Active Water Filter", "Basic Workstation"];
        var electronicParts = ["Audio Transmitter", "Active Cooling Device", "Memory Bank", "Micro-Processor", "Motherboard", "Non-Volatile Memory", "Printed Circuit Board", "Sensor", "Tensor Processing Unit", "Capacitive Display", "Information Display"];
        var electronicPieces = ["Shielded Connectors", "Electric Field Capacitor", "Budget Connectors", "Medium Fastener Kit", "Small Fastener Kit", "Laser Diodes", "High-Capacity Connectors", "Advanced Transistor", "Medium Wafer", "Small Wafer"];
        var electronicSystems = ["Audio Distribution System", "Automated Cooling System", "Climate Controller", "Communication System", "Cryogenic Unit", "FTL Field Controller", "Life Support System", "Logistics System", "Stability Support System", "Targeting Computer", "Water Reclaimer"];
        var elements = ["Beryllium", "Calcium", "Carbon", "Chlorine", "Einsteinium", "Iodine", "Magnesium", "Sodium", "Sulfur", "Tantalum", "Technetium", "Zirconium"];
        var energySystems = ["Large Capacitor Bank", "Medium Capacitor Bank", "Power Cell", "Small Capacitor Bank", "Solar Cell", "Solar Panel"];
        var fuels = ["FTL Fuel", "STL Fuel"];
        var gases = ["Ammonia", "Argon", "Fluorine", "Helium", "Helium-3 Isotope", "Hydrogen", "Neon", "Nitrogen", "Oxygen"];
        var liquids = ["Heliotrope Extract", "Liquid Einsteinium", "Bacterial Tungsten Solution", "Water"];
        var medicalEquipment = ["Auto-Doc", "Bandages", "Medical Stretcher", "Painkillers", "Surgical Equipment", "Test Tubes"];
        var metals = ["Aluminium", "Copper", "Gold", "Iron", "Lithium", "Silicon", "Steel", "Titanium", "Tungsten"];
        var minerals = ["Beryl Crystals", "Bioreactive Minerals", "Boron Crystals", "Caliche Rock", "Galerite Rock", "Halite Crystals", "Limestone", "Magnesite", "Magnetite", "Sulfur Crystals", "Tantalite Rock", "Technetium Oxide", "Tectosilisite", "Zircon Crystals"];
        var ores = ["Aluminium Ore", "Copper Ore", "Gold Ore", "Iron Ore", "Lithium Ore", "Silicon Ore", "Titanium Ore"];
        var plastics = ["Durable Casing L", "Polymer Sheet Type L", "Durable Casing M", "Polymer Sheet Type M", "Poly-Ethylene", "Polymer Granulate", "Durable Casing S", "Polymer Sheet Type S"];

        var products = agricultural.concat(alloys).concat(chemicals).concat(constructionMaterials).concat(constructionParts).concat(constructionPrefabs).concat(basicConsumables).concat(luxuryConsumables).concat(drones).concat(electronicDevices).concat(electronicParts).concat(electronicPieces).concat(electronicSystems).concat(elements).concat(energySystems).concat(fuels).concat(gases).concat(liquids).concat(medicalEquipment).concat(metals).concat(minerals).concat(ores).concat(plastics);

        var found;
        for (var i2 = 0; i2 < products.length; i2++){
            for (var i = 0; i < aTags.length; i++) {
                if (aTags[i].textContent == products[i2] && aTags[i].parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.children[0].children[0].textContent == 'Moria Station Commodity Exchange') {
                    found = aTags[i];
                    if(found.parentElement.children.length == 2){
                        var productAsk = "---";
                        var productBid = "---";

                        if(found.parentElement.parentElement.children[3].children.length == 2){
                            productAsk = found.parentElement.parentElement.children[3].children[0].children[0].children[0].textContent;
                        }
                        if(found.parentElement.parentElement.children[4].children.length == 2){
                            productBid = found.parentElement.parentElement.children[4].children[0].children[0].children[0].textContent;
                        }
                        prices[found.textContent] = [productAsk, productBid];
                    }
                }
            }
        }

        console.log(JSON.stringify(prices));
        navigator.clipboard.writeText(JSON.stringify(prices));
    }
})();