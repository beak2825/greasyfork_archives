// ==UserScript==
// @name         Dead Frontier Weapon Data
// @namespace    http://tampermonkey.net/
// @version      1.4.8
// @description  Provides weapon data for Dead Frontier Tooltip DPS Injector
// @author       ils94
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=24
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=25
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=28*
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=35
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=50
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=59
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=81
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=82*
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=84
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/DF3D/DF3D_InventoryPage.php?page=31*
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=32*
// @license      MIT
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/535178/Dead%20Frontier%20Weapon%20Data.user.js
// @updateURL https://update.greasyfork.org/scripts/535178/Dead%20Frontier%20Weapon%20Data.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.weaponData = {
    "weapons": [
        {
            "name": "fists",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "0.48",
                    "theoretical": "0.5",
                    "critical": "1.26",
                    "theoretical_critical": "1.3"
                },
                "DPH": {
                    "total": "0.5",
                    "critical": "2.5"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                },
                "Melee Range": {
                    "range": "1",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "firepoker",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "2.42",
                    "theoretical": "2.5",
                    "critical": "10.16",
                    "theoretical_critical": "10.5"
                },
                "DPH": {
                    "total": "2.5",
                    "critical": "12.5"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                },
                "Melee Range": {
                    "range": "1.5",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "baseballbat",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "3.87",
                    "theoretical": "4",
                    "critical": "16.26",
                    "theoretical_critical": "16.8"
                },
                "DPH": {
                    "total": "4",
                    "critical": "20"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                },
                "Melee Range": {
                    "range": "1.5",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "penknife",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "4.29",
                    "theoretical": "4.5",
                    "critical": "18.01",
                    "theoretical_critical": "18.9"
                },
                "DPH": {
                    "total": "3",
                    "critical": "15"
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                },
                "Melee Range": {
                    "range": "1",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "huntingknife",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "5.72",
                    "theoretical": "6",
                    "critical": "24.01",
                    "theoretical_critical": "25.2"
                },
                "DPH": {
                    "total": "4",
                    "critical": "20"
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                },
                "Melee Range": {
                    "range": "1",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "cricketbat",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "5.81",
                    "theoretical": "6",
                    "critical": "24.39",
                    "theoretical_critical": "25.2"
                },
                "DPH": {
                    "total": "6",
                    "critical": "30"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                },
                "Melee Range": {
                    "range": "1.5",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "golfclub",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "4.84",
                    "theoretical": "5",
                    "critical": "20.33",
                    "theoretical_critical": "21"
                },
                "DPH": {
                    "total": "5",
                    "critical": "25"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                },
                "Melee Range": {
                    "range": "2.1",
                    "cleave_width": "1.7"
                }
            }
        },
        {
            "name": "chefknife",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "5",
                    "theoretical": "5.25",
                    "critical": "21.01",
                    "theoretical_critical": "22.05"
                },
                "DPH": {
                    "total": "3.5",
                    "critical": "17.5"
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                },
                "Melee Range": {
                    "range": "1",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "fireaxe",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "7.74",
                    "theoretical": "8",
                    "critical": "32.52",
                    "theoretical_critical": "33.6"
                },
                "DPH": {
                    "total": "8",
                    "critical": "40"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                },
                "Melee Range": {
                    "range": "1.5",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "woodmaul",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "4.84",
                    "theoretical": "5",
                    "critical": "20.33",
                    "theoretical_critical": "21"
                },
                "DPH": {
                    "total": "5",
                    "critical": "25"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                },
                "Melee Range": {
                    "range": "1.5",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "woodspear",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "4.84",
                    "theoretical": "5",
                    "critical": "20.33",
                    "theoretical_critical": "21"
                },
                "DPH": {
                    "total": "5",
                    "critical": "25"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                },
                "Melee Range": {
                    "range": "1.95",
                    "cleave_width": "1.7"
                }
            }
        },
        {
            "name": "combatknife",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "8.57",
                    "theoretical": "9",
                    "critical": "36.01",
                    "theoretical_critical": "37.8"
                },
                "DPH": {
                    "total": "6",
                    "critical": "30"
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                },
                "Melee Range": {
                    "range": "1",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "ironpipe",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "9.68",
                    "theoretical": "10",
                    "critical": "40.66",
                    "theoretical_critical": "42"
                },
                "DPH": {
                    "total": "10",
                    "critical": "50"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                },
                "Melee Range": {
                    "range": "1.5",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "bowieknife",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "11.43",
                    "theoretical": "12",
                    "critical": "48.01",
                    "theoretical_critical": "50.4"
                },
                "DPH": {
                    "total": "8",
                    "critical": "40"
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                },
                "Melee Range": {
                    "range": "1",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "nailbat",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "7.74",
                    "theoretical": "8",
                    "critical": "32.52",
                    "theoretical_critical": "33.6"
                },
                "DPH": {
                    "total": "8",
                    "critical": "40"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                },
                "Melee Range": {
                    "range": "1.5",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "superslugger",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "9.68",
                    "theoretical": "10",
                    "critical": "40.66",
                    "theoretical_critical": "42"
                },
                "DPH": {
                    "total": "10",
                    "critical": "50"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                },
                "Melee Range": {
                    "range": "1.5",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "razor",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "12.86",
                    "theoretical": "13.5",
                    "critical": "54.02",
                    "theoretical_critical": "56.7"
                },
                "DPH": {
                    "total": "9",
                    "critical": "45"
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                },
                "Melee Range": {
                    "range": "1",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "crowbar",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "13.55",
                    "theoretical": "14",
                    "critical": "56.92",
                    "theoretical_critical": "58.8"
                },
                "DPH": {
                    "total": "14",
                    "critical": "70"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                },
                "Melee Range": {
                    "range": "1.5",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "scalpel",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "14.29",
                    "theoretical": "15",
                    "critical": "60.02",
                    "theoretical_critical": "63"
                },
                "DPH": {
                    "total": "10",
                    "critical": "50"
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                },
                "Melee Range": {
                    "range": "1",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "shovel",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "15.49",
                    "theoretical": "16",
                    "critical": "65.05",
                    "theoretical_critical": "67.2"
                },
                "DPH": {
                    "total": "16",
                    "critical": "80"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                },
                "Melee Range": {
                    "range": "1.95",
                    "cleave_width": "1.7"
                }
            }
        },
        {
            "name": "kris",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "14.29",
                    "theoretical": "15",
                    "critical": "60.02",
                    "theoretical_critical": "63"
                },
                "DPH": {
                    "total": "10",
                    "critical": "50"
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                },
                "Melee Range": {
                    "range": "1.25",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "woodaxe",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "17.42",
                    "theoretical": "18",
                    "critical": "73.18",
                    "theoretical_critical": "75.6"
                },
                "DPH": {
                    "total": "18",
                    "critical": "90"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                },
                "Melee Range": {
                    "range": "1.5",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "skullsplitter",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "19.36",
                    "theoretical": "20",
                    "critical": "81.31",
                    "theoretical_critical": "84"
                },
                "DPH": {
                    "total": "20",
                    "critical": "100"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                },
                "Melee Range": {
                    "range": "1.5",
                    "cleave_width": "0"
                }
            }
        },
        {
            "name": "trenchknife",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "18.58",
                    "theoretical": "19.5",
                    "critical": "78.02",
                    "theoretical_critical": "81.9"
                },
                "DPH": {
                    "total": "13",
                    "critical": "65"
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                },
                "Melee Range": {
                    "range": "1.25",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "machete",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "21.3",
                    "theoretical": "22",
                    "critical": "89.44",
                    "theoretical_critical": "92.4"
                },
                "DPH": {
                    "total": "22",
                    "critical": "110"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                },
                "Melee Range": {
                    "range": "1.5",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "k9",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "21.44",
                    "theoretical": "22.5",
                    "critical": "90.03",
                    "theoretical_critical": "94.5"
                },
                "DPH": {
                    "total": "15",
                    "critical": "75"
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                },
                "Melee Range": {
                    "range": "1.25",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "sabre",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "25.17",
                    "theoretical": "26",
                    "critical": "105.71",
                    "theoretical_critical": "109.2"
                },
                "DPH": {
                    "total": "26",
                    "critical": "130"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                },
                "Melee Range": {
                    "range": "1.5",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "kukri",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "27.15",
                    "theoretical": "28.5",
                    "critical": "114.03",
                    "theoretical_critical": "119.7"
                },
                "DPH": {
                    "total": "19",
                    "critical": "95"
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                },
                "Melee Range": {
                    "range": "1.25",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "sledgehammer",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "27.1",
                    "theoretical": "28",
                    "critical": "113.84",
                    "theoretical_critical": "117.6"
                },
                "DPH": {
                    "total": "28",
                    "critical": "140"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                },
                "Melee Range": {
                    "range": "1.5",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "tenderizer",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "29.04",
                    "theoretical": "30",
                    "critical": "121.97",
                    "theoretical_critical": "126"
                },
                "DPH": {
                    "total": "30",
                    "critical": "150"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                },
                "Melee Range": {
                    "range": "1.5",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "goldensledgehammer",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "29.04",
                    "theoretical": "30",
                    "critical": "121.97",
                    "theoretical_critical": "126"
                },
                "DPH": {
                    "total": "30",
                    "critical": "150"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                },
                "Melee Range": {
                    "range": "1.5",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "grizzlyknife",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "28.58",
                    "theoretical": "30",
                    "critical": "120.04",
                    "theoretical_critical": "126"
                },
                "DPH": {
                    "total": "20",
                    "critical": "100"
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                },
                "Melee Range": {
                    "range": "1.25",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "bm14survival",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "35.73",
                    "theoretical": "37.5",
                    "critical": "150.05",
                    "theoretical_critical": "157.5"
                },
                "DPH": {
                    "total": "25",
                    "critical": "125"
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                },
                "Melee Range": {
                    "range": "1.5",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "bm14savage",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "46.88",
                    "theoretical": "50",
                    "critical": "196.88",
                    "theoretical_critical": "210"
                },
                "DPH": {
                    "total": "25",
                    "critical": "125"
                },
                "HPS": {
                    "real": "1.875",
                    "theoretical": "2"
                },
                "Melee Range": {
                    "range": "1.5",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "battleaxe",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "31.94",
                    "theoretical": "33",
                    "critical": "134.16",
                    "theoretical_critical": "138.6"
                },
                "DPH": {
                    "total": "33",
                    "critical": "165"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                },
                "Melee Range": {
                    "range": "1.5",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "katana",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "33.88",
                    "theoretical": "35",
                    "critical": "142.3",
                    "theoretical_critical": "147"
                },
                "DPH": {
                    "total": "35",
                    "critical": "175"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                },
                "Melee Range": {
                    "range": "1.5",
                    "cleave_width": "0"
                }
            }
        },
        {
            "name": "wakizashi",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "42.87",
                    "theoretical": "45",
                    "critical": "180.05",
                    "theoretical_critical": "189"
                },
                "DPH": {
                    "total": "30",
                    "critical": "150"
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                },
                "Melee Range": {
                    "range": "1.5",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "nodachi",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "38.72",
                    "theoretical": "40",
                    "critical": "162.62",
                    "theoretical_critical": "168"
                },
                "DPH": {
                    "total": "40",
                    "critical": "200"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                },
                "Melee Range": {
                    "range": "1.95",
                    "cleave_width": "1.7"
                }
            }
        },
        {
            "name": "noblenodachi",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "48.4",
                    "theoretical": "50",
                    "critical": "203.28",
                    "theoretical_critical": "210"
                },
                "DPH": {
                    "total": "50",
                    "critical": "250"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                },
                "Melee Range": {
                    "range": "2.2",
                    "cleave_width": "1.9"
                }
            }
        },
        {
            "name": "spiker",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "48.4",
                    "theoretical": "50",
                    "critical": "203.28",
                    "theoretical_critical": "210"
                },
                "DPH": {
                    "total": "50",
                    "critical": "250"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                },
                "Melee Range": {
                    "range": "1.75",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "gorespikewaraxe",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "62.92",
                    "theoretical": "65",
                    "critical": "264.26",
                    "theoretical_critical": "273"
                },
                "DPH": {
                    "total": "65",
                    "critical": "325"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                },
                "Melee Range": {
                    "range": "2.2",
                    "cleave_width": "2"
                }
            }
        },
        {
            "name": "piercer",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "48.59",
                    "theoretical": "51",
                    "critical": "204.06",
                    "theoretical_critical": "214.2"
                },
                "DPH": {
                    "total": "34",
                    "critical": "170"
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                },
                "Melee Range": {
                    "range": "1.5",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "dualblade",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "58.08",
                    "theoretical": "60",
                    "critical": "243.94",
                    "theoretical_critical": "252"
                },
                "DPH": {
                    "total": "60",
                    "critical": "300"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                },
                "Melee Range": {
                    "range": "1.75",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "bonecleaver",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "60.02",
                    "theoretical": "63",
                    "critical": "252.08",
                    "theoretical_critical": "264.6"
                },
                "DPH": {
                    "total": "42",
                    "critical": "210"
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                },
                "Melee Range": {
                    "range": "1.5",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "xhammer",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "77.44",
                    "theoretical": "80",
                    "critical": "325.25",
                    "theoretical_critical": "336"
                },
                "DPH": {
                    "total": "80",
                    "critical": "400"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                },
                "Melee Range": {
                    "range": "1.8",
                    "cleave_width": "1.8"
                }
            }
        },
        {
            "name": "xkukri",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "85.74",
                    "theoretical": "90",
                    "critical": "360.11",
                    "theoretical_critical": "378"
                },
                "DPH": {
                    "total": "60",
                    "critical": "300"
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                },
                "Melee Range": {
                    "range": "1.75",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "inquisitor",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "100.03",
                    "theoretical": "105",
                    "critical": "420.13",
                    "theoretical_critical": "441"
                },
                "DPH": {
                    "total": "70",
                    "critical": "350"
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                },
                "Melee Range": {
                    "range": "1.75",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "decapitator",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "103.13",
                    "theoretical": "110",
                    "critical": "433.13",
                    "theoretical_critical": "462"
                },
                "DPH": {
                    "total": "55",
                    "critical": "275"
                },
                "HPS": {
                    "real": "1.875",
                    "theoretical": "2"
                },
                "Melee Range": {
                    "range": "1.75",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "bloodseeker",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "131.25",
                    "theoretical": "140",
                    "critical": "551.25",
                    "theoretical_critical": "588"
                },
                "DPH": {
                    "total": "70",
                    "critical": "350"
                },
                "HPS": {
                    "real": "1.875",
                    "theoretical": "2"
                },
                "Melee Range": {
                    "range": "2",
                    "cleave_width": "1.6"
                }
            }
        },
        {
            "name": "doomstar",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "154.88",
                    "theoretical": "160",
                    "critical": "650.5",
                    "theoretical_critical": "672"
                },
                "DPH": {
                    "total": "160",
                    "critical": "800"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                },
                "Melee Range": {
                    "range": "2.2",
                    "cleave_width": "1.6"
                }
            }
        },
        {
            "name": "forsakentitaniumblades",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "81.81",
                    "theoretical": "90",
                    "critical": "343.6",
                    "theoretical_critical": "378"
                },
                "DPH": {
                    "total": "30",
                    "critical": "150"
                },
                "HPS": {
                    "real": "2.727",
                    "theoretical": "3"
                },
                "Melee Range": {
                    "range": "1.5",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "amputator",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "38.72",
                    "theoretical": "40",
                    "critical": "162.62",
                    "theoretical_critical": "168"
                },
                "DPH": {
                    "total": "40",
                    "critical": "200"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                },
                "Melee Range": {
                    "range": "1.5",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "doomcane",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "38.72",
                    "theoretical": "40",
                    "critical": "162.62",
                    "theoretical_critical": "168"
                },
                "DPH": {
                    "total": "40",
                    "critical": "200"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                },
                "Melee Range": {
                    "range": "1.5",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "corpsecrusher",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "38.72",
                    "theoretical": "40",
                    "critical": "162.62",
                    "theoretical_critical": "168"
                },
                "DPH": {
                    "total": "40",
                    "critical": "200"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                },
                "Melee Range": {
                    "range": "1.5",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "gutsplitter",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "57.16",
                    "theoretical": "60",
                    "critical": "240.07",
                    "theoretical_critical": "252"
                },
                "DPH": {
                    "total": "40",
                    "critical": "200"
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                },
                "Melee Range": {
                    "range": "1.75",
                    "cleave_width": "2"
                }
            }
        },
        {
            "name": "sharktail",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "58.08",
                    "theoretical": "60",
                    "critical": "243.94",
                    "theoretical_critical": "252"
                },
                "DPH": {
                    "total": "60",
                    "critical": "300"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                },
                "Melee Range": {
                    "range": "1.75",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "crowslayer",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "72.6",
                    "theoretical": "75",
                    "critical": "304.92",
                    "theoretical_critical": "315"
                },
                "DPH": {
                    "total": "75",
                    "critical": "375"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                },
                "Melee Range": {
                    "range": "1.5",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "duskkris",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "78.6",
                    "theoretical": "82.5",
                    "critical": "330.1",
                    "theoretical_critical": "346.5"
                },
                "DPH": {
                    "total": "55",
                    "critical": "275"
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                },
                "Melee Range": {
                    "range": "1.8",
                    "cleave_width": "1.5"
                }
            }
        },
        {
            "name": "duskrazor",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "77.44",
                    "theoretical": "80",
                    "critical": "325.25",
                    "theoretical_critical": "336"
                },
                "DPH": {
                    "total": "80",
                    "critical": "400"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                },
                "Melee Range": {
                    "range": "2",
                    "cleave_width": "1.9"
                }
            }
        },
        {
            "name": "xduskkris",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "100.03",
                    "theoretical": "105",
                    "critical": "420.13",
                    "theoretical_critical": "441"
                },
                "DPH": {
                    "total": "70",
                    "critical": "350"
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                },
                "Melee Range": {
                    "range": "1.8",
                    "cleave_width": "1.5"
                }
            }
        },
        {
            "name": "xduskrazor",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "96.8",
                    "theoretical": "100",
                    "critical": "406.56",
                    "theoretical_critical": "420"
                },
                "DPH": {
                    "total": "100",
                    "critical": "500"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                },
                "Melee Range": {
                    "range": "2",
                    "cleave_width": "1.9"
                }
            }
        },
        {
            "name": "dawnkris",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "140.63",
                    "theoretical": "150",
                    "critical": "590.63",
                    "theoretical_critical": "630"
                },
                "DPH": {
                    "total": "75",
                    "critical": "375"
                },
                "HPS": {
                    "real": "1.875",
                    "theoretical": "2"
                },
                "Melee Range": {
                    "range": "1.8",
                    "cleave_width": "1.5"
                }
            }
        },
        {
            "name": "dawnblade",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "142.9",
                    "theoretical": "150",
                    "critical": "600.18",
                    "theoretical_critical": "630"
                },
                "DPH": {
                    "total": "100",
                    "critical": "500"
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                },
                "Melee Range": {
                    "range": "2",
                    "cleave_width": "1.9"
                }
            }
        },
        {
            "name": "survivorscombatknife",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "23.94",
                    "theoretical": "25.13",
                    "critical": "100.53",
                    "theoretical_critical": "105.53"
                },
                "DPH": {
                    "total": "16.75",
                    "critical": "83.75"
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                },
                "Melee Range": {
                    "range": "1",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "santasslayer",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "68.18",
                    "theoretical": "75",
                    "critical": "286.34",
                    "theoretical_critical": "315"
                },
                "DPH": {
                    "total": "25",
                    "critical": "125"
                },
                "HPS": {
                    "real": "2.727",
                    "theoretical": "3"
                },
                "Melee Range": {
                    "range": "2",
                    "cleave_width": "1.6"
                }
            }
        },
        {
            "name": "bloodymachete",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "71.45",
                    "theoretical": "75",
                    "critical": "300.09",
                    "theoretical_critical": "315"
                },
                "DPH": {
                    "total": "50",
                    "critical": "250"
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                },
                "Melee Range": {
                    "range": "1.5",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "harvesterofsorrow",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "71.45",
                    "theoretical": "75",
                    "critical": "300.09",
                    "theoretical_critical": "315"
                },
                "DPH": {
                    "total": "50",
                    "critical": "250"
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                },
                "Melee Range": {
                    "range": "2.2",
                    "cleave_width": "1.6"
                }
            }
        },
        {
            "name": "northpoleaxe",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "71.45",
                    "theoretical": "75",
                    "critical": "300.09",
                    "theoretical_critical": "315"
                },
                "DPH": {
                    "total": "50",
                    "critical": "250"
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                },
                "Melee Range": {
                    "range": "2.2",
                    "cleave_width": "1.6"
                }
            }
        },
        {
            "name": "eggsterminator",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "95.16",
                    "theoretical": "97.5",
                    "critical": "399.67",
                    "theoretical_critical": "409.5"
                },
                "DPH": {
                    "total": "130",
                    "critical": "650"
                },
                "HPS": {
                    "real": "0.732",
                    "theoretical": "0.75"
                },
                "Melee Range": {
                    "range": "2.2",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "tidebreaker",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "87.12",
                    "theoretical": "90",
                    "critical": "365.9",
                    "theoretical_critical": "378"
                },
                "DPH": {
                    "total": "90",
                    "critical": "450"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                },
                "Melee Range": {
                    "range": "2.2",
                    "cleave_width": "1.6"
                }
            }
        },
        {
            "name": "betatomcatstarter",
            "category": "Pistols",
            "stats": {
                "DPS": {
                    "real": "5.63",
                    "theoretical": "6",
                    "critical": "23.63",
                    "theoretical_critical": "25.2"
                },
                "DPH": {
                    "total": "3",
                    "critical": "15"
                },
                "HPS": {
                    "real": "1.875",
                    "theoretical": "2"
                }
            }
        },
        {
            "name": "betatomcat",
            "category": "Pistols",
            "stats": {
                "DPS": {
                    "real": "5.63",
                    "theoretical": "6",
                    "critical": "23.63",
                    "theoretical_critical": "25.2"
                },
                "DPH": {
                    "total": "3",
                    "critical": "15"
                },
                "HPS": {
                    "real": "1.875",
                    "theoretical": "2"
                }
            }
        },
        {
            "name": "williamsppk",
            "category": "Pistols",
            "stats": {
                "DPS": {
                    "real": "7.5",
                    "theoretical": "8",
                    "critical": "31.5",
                    "theoretical_critical": "33.6"
                },
                "DPH": {
                    "total": "4",
                    "critical": "20"
                },
                "HPS": {
                    "real": "1.875",
                    "theoretical": "2"
                }
            }
        },
        {
            "name": "gerringhp",
            "category": "Pistols",
            "stats": {
                "DPS": {
                    "real": "9.38",
                    "theoretical": "10",
                    "critical": "39.38",
                    "theoretical_critical": "42"
                },
                "DPH": {
                    "total": "5",
                    "critical": "25"
                },
                "HPS": {
                    "real": "1.875",
                    "theoretical": "2"
                }
            }
        },
        {
            "name": "fiftyseven",
            "category": "Pistols",
            "stats": {
                "DPS": {
                    "real": "10.31",
                    "theoretical": "11",
                    "critical": "43.31",
                    "theoretical_critical": "46.2"
                },
                "DPH": {
                    "total": "5.5",
                    "critical": "27.5"
                },
                "HPS": {
                    "real": "1.875",
                    "theoretical": "2"
                }
            }
        },
        {
            "name": "lock19",
            "category": "Pistols",
            "stats": {
                "DPS": {
                    "real": "11.25",
                    "theoretical": "12",
                    "critical": "47.25",
                    "theoretical_critical": "50.4"
                },
                "DPH": {
                    "total": "6",
                    "critical": "30"
                },
                "HPS": {
                    "real": "1.875",
                    "theoretical": "2"
                }
            }
        },
        {
            "name": "koltpython",
            "category": "Pistols",
            "stats": {
                "DPS": {
                    "real": "11.43",
                    "theoretical": "12",
                    "critical": "48.01",
                    "theoretical_critical": "50.4"
                },
                "DPH": {
                    "total": "8",
                    "critical": "40"
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                }
            }
        },
        {
            "name": "beta8000",
            "category": "Pistols",
            "stats": {
                "DPS": {
                    "real": "14.06",
                    "theoretical": "15",
                    "critical": "59.06",
                    "theoretical_critical": "63"
                },
                "DPH": {
                    "total": "7.5",
                    "critical": "37.5"
                },
                "HPS": {
                    "real": "1.875",
                    "theoretical": "2"
                }
            }
        },
        {
            "name": "ck75",
            "category": "Pistols",
            "stats": {
                "DPS": {
                    "real": "15",
                    "theoretical": "16",
                    "critical": "63",
                    "theoretical_critical": "67.2"
                },
                "DPH": {
                    "total": "8",
                    "critical": "40"
                },
                "HPS": {
                    "real": "1.875",
                    "theoretical": "2"
                }
            }
        },
        {
            "name": "ck75auto",
            "category": "Pistols",
            "stats": {
                "DPS": {
                    "real": "16.67",
                    "theoretical": "21.43",
                    "critical": "70.01",
                    "theoretical_critical": "90"
                },
                "DPH": {
                    "total": "2.5",
                    "critical": "12.5"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                }
            }
        },
        {
            "name": "luger",
            "category": "Pistols",
            "stats": {
                "DPS": {
                    "real": "15.94",
                    "theoretical": "17",
                    "critical": "66.94",
                    "theoretical_critical": "71.4"
                },
                "DPH": {
                    "total": "8.5",
                    "critical": "42.5"
                },
                "HPS": {
                    "real": "1.875",
                    "theoretical": "2"
                }
            }
        },
        {
            "name": "lock17",
            "category": "Pistols",
            "stats": {
                "DPS": {
                    "real": "16.88",
                    "theoretical": "18",
                    "critical": "70.88",
                    "theoretical_critical": "75.6"
                },
                "DPH": {
                    "total": "9",
                    "critical": "45"
                },
                "HPS": {
                    "real": "1.875",
                    "theoretical": "2"
                }
            }
        },
        {
            "name": "webster1942",
            "category": "Pistols",
            "stats": {
                "DPS": {
                    "real": "15.72",
                    "theoretical": "16.5",
                    "critical": "66.02",
                    "theoretical_critical": "69.3"
                },
                "DPH": {
                    "total": "11",
                    "critical": "55"
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                }
            }
        },
        {
            "name": "lock25",
            "category": "Pistols",
            "stats": {
                "DPS": {
                    "real": "18.75",
                    "theoretical": "20",
                    "critical": "78.75",
                    "theoretical_critical": "84"
                },
                "DPH": {
                    "total": "10",
                    "critical": "50"
                },
                "HPS": {
                    "real": "1.875",
                    "theoretical": "2"
                }
            }
        },
        {
            "name": "makeshiftrevolver",
            "category": "Pistols",
            "stats": {
                "DPS": {
                    "real": "18.58",
                    "theoretical": "19.5",
                    "critical": "77.45",
                    "theoretical_critical": "81.3"
                },
                "DPH": {
                    "total": "13",
                    "critical": "65"
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                }
            }
        },
        {
            "name": "lock25xmos",
            "category": "Pistols",
            "stats": {
                "DPS": {
                    "real": "20.63",
                    "theoretical": "22",
                    "critical": "86.63",
                    "theoretical_critical": "92.4"
                },
                "DPH": {
                    "total": "11",
                    "critical": "55"
                },
                "HPS": {
                    "real": "1.875",
                    "theoretical": "2"
                }
            }
        },
        {
            "name": "ck99",
            "category": "Pistols",
            "stats": {
                "DPS": {
                    "real": "20.63",
                    "theoretical": "22",
                    "critical": "86.63",
                    "theoretical_critical": "92.4"
                },
                "DPH": {
                    "total": "11",
                    "critical": "55"
                },
                "HPS": {
                    "real": "1.875",
                    "theoretical": "2"
                }
            }
        },
        {
            "name": "koltanaconda",
            "category": "Pistols",
            "stats": {
                "DPS": {
                    "real": "20.01",
                    "theoretical": "21",
                    "critical": "84.03",
                    "theoretical_critical": "88.2"
                },
                "DPH": {
                    "total": "14",
                    "critical": "70"
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                }
            }
        },
        {
            "name": "sicapollo",
            "category": "Pistols",
            "stats": {
                "DPS": {
                    "real": "22.5",
                    "theoretical": "24",
                    "critical": "94.5",
                    "theoretical_critical": "100.8"
                },
                "DPH": {
                    "total": "12",
                    "critical": "60"
                },
                "HPS": {
                    "real": "1.875",
                    "theoretical": "2"
                }
            }
        },
        {
            "name": "usp",
            "category": "Pistols",
            "stats": {
                "DPS": {
                    "real": "26.25",
                    "theoretical": "28",
                    "critical": "110.25",
                    "theoretical_critical": "117.6"
                },
                "DPH": {
                    "total": "14",
                    "critical": "70"
                },
                "HPS": {
                    "real": "1.875",
                    "theoretical": "2"
                }
            }
        },
        {
            "name": "sw500",
            "category": "Pistols",
            "stats": {
                "DPS": {
                    "real": "24.29",
                    "theoretical": "25.5",
                    "critical": "102.03",
                    "theoretical_critical": "107.1"
                },
                "DPH": {
                    "total": "17",
                    "critical": "85"
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                }
            }
        },
        {
            "name": "ck97b",
            "category": "Pistols",
            "stats": {
                "DPS": {
                    "real": "28.13",
                    "theoretical": "30",
                    "critical": "118.13",
                    "theoretical_critical": "126"
                },
                "DPH": {
                    "total": "15",
                    "critical": "75"
                },
                "HPS": {
                    "real": "1.875",
                    "theoretical": "2"
                }
            }
        },
        {
            "name": "steelrangerr03",
            "category": "Pistols",
            "stats": {
                "DPS": {
                    "real": "28.58",
                    "theoretical": "30",
                    "critical": "120.04",
                    "theoretical_critical": "126"
                },
                "DPH": {
                    "total": "20",
                    "critical": "100"
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                }
            }
        },
        {
            "name": "desertfox",
            "category": "Pistols",
            "stats": {
                "DPS": {
                    "real": "30",
                    "theoretical": "32",
                    "critical": "126",
                    "theoretical_critical": "134.4"
                },
                "DPH": {
                    "total": "16",
                    "critical": "80"
                },
                "HPS": {
                    "real": "1.875",
                    "theoretical": "2"
                }
            }
        },
        {
            "name": "alphabull",
            "category": "Pistols",
            "stats": {
                "DPS": {
                    "real": "31.44",
                    "theoretical": "33",
                    "critical": "132.04",
                    "theoretical_critical": "138.6"
                },
                "DPH": {
                    "total": "22",
                    "critical": "110"
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                }
            }
        },
        {
            "name": "thunder12",
            "category": "Pistols",
            "stats": {
                "DPS": {
                    "real": "49.3",
                    "theoretical": "50",
                    "critical": "207.06",
                    "theoretical_critical": "210"
                },
                "DPH": {
                    "total": "50",
                    "critical": "250"
                },
                "HPS": {
                    "real": "0.986",
                    "theoretical": "1"
                }
            }
        },
        {
            "name": "475magnum",
            "category": "Pistols",
            "stats": {
                "DPS": {
                    "real": "37.5",
                    "theoretical": "40",
                    "critical": "157.5",
                    "theoretical_critical": "168"
                },
                "DPH": {
                    "total": "20",
                    "critical": "100"
                },
                "HPS": {
                    "real": "1.875",
                    "theoretical": "2"
                }
            }
        },
        {
            "name": "ash12",
            "category": "Pistols",
            "stats": {
                "DPS": {
                    "real": "35.73",
                    "theoretical": "37.5",
                    "critical": "150.05",
                    "theoretical_critical": "157.5"
                },
                "DPH": {
                    "total": "25",
                    "critical": "125"
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                }
            }
        },
        {
            "name": "mirages8",
            "category": "Pistols",
            "stats": {
                "DPS": {
                    "real": "46.88",
                    "theoretical": "50",
                    "critical": "196.88",
                    "theoretical_critical": "210"
                },
                "DPH": {
                    "total": "25",
                    "critical": "125"
                },
                "HPS": {
                    "real": "1.875",
                    "theoretical": "2"
                }
            }
        },
        {
            "name": "greyhawk55",
            "category": "Pistols",
            "stats": {
                "DPS": {
                    "real": "42.87",
                    "theoretical": "45",
                    "critical": "180.05",
                    "theoretical_critical": "189"
                },
                "DPH": {
                    "total": "30",
                    "critical": "150"
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                }
            }
        },
        {
            "name": "daystar55",
            "category": "Pistols",
            "stats": {
                "DPS": {
                    "real": "56.25",
                    "theoretical": "60",
                    "critical": "236.25",
                    "theoretical_critical": "252"
                },
                "DPH": {
                    "total": "30",
                    "critical": "150"
                },
                "HPS": {
                    "real": "1.875",
                    "theoretical": "2"
                }
            }
        },
        {
            "name": "doubleshotaax",
            "category": "Pistols",
            "stats": {
                "DPS": {
                    "real": "71.45",
                    "theoretical": "75",
                    "critical": "300.09",
                    "theoretical_critical": "315"
                },
                "DPH": {
                    "total": "25 x 2 = 50",
                    "critical": "125"
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                }
            }
        },
        {
            "name": "xpython",
            "category": "Pistols",
            "stats": {
                "DPS": {
                    "real": "85.74",
                    "theoretical": "90",
                    "critical": "360.11",
                    "theoretical_critical": "378"
                },
                "DPH": {
                    "total": "60",
                    "critical": "300"
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                }
            }
        },
        {
            "name": "xpython55",
            "category": "Pistols",
            "stats": {
                "DPS": {
                    "real": "85.74",
                    "theoretical": "90",
                    "critical": "360.11",
                    "theoretical_critical": "378"
                },
                "DPH": {
                    "total": "60",
                    "critical": "300"
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                }
            }
        },
        {
            "name": "qr22obsidian",
            "category": "Pistols",
            "stats": {
                "DPS": {
                    "real": "93.75",
                    "theoretical": "100",
                    "critical": "393.75",
                    "theoretical_critical": "420"
                },
                "DPH": {
                    "total": "50",
                    "critical": "250"
                },
                "HPS": {
                    "real": "1.875",
                    "theoretical": "2"
                }
            }
        },
        {
            "name": "rhea55",
            "category": "Pistols",
            "stats": {
                "DPS": {
                    "real": "100.03",
                    "theoretical": "105",
                    "critical": "420.13",
                    "theoretical_critical": "441"
                },
                "DPH": {
                    "total": "70",
                    "critical": "350"
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                }
            }
        },
        {
            "name": "hornetyj9",
            "category": "Pistols",
            "stats": {
                "DPS": {
                    "real": "112.5",
                    "theoretical": "120",
                    "critical": "472.5",
                    "theoretical_critical": "504"
                },
                "DPH": {
                    "total": "60",
                    "critical": "300"
                },
                "HPS": {
                    "real": "1.875",
                    "theoretical": "2"
                }
            }
        },
        {
            "name": "wyvernrx8",
            "category": "Pistols",
            "stats": {
                "DPS": {
                    "real": "656.25",
                    "theoretical": "700",
                    "critical": null,
                    "theoretical_critical": null
                },
                "DPH": {
                    "total": "280 + 70 = 350",
                    "critical": null
                },
                "HPS": {
                    "real": "1.875",
                    "theoretical": "2"
                }
            }
        },
        {
            "name": "corpseshooter",
            "category": "Pistols",
            "stats": {
                "DPS": {
                    "real": "35.73",
                    "theoretical": "37.5",
                    "critical": "150.05",
                    "theoretical_critical": "157.5"
                },
                "DPH": {
                    "total": "25",
                    "critical": "125"
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                }
            }
        },
        {
            "name": "vlockxd11",
            "category": "Pistols",
            "stats": {
                "DPS": {
                    "real": "56.25",
                    "theoretical": "60",
                    "critical": "236.25",
                    "theoretical_critical": "252"
                },
                "DPH": {
                    "total": "30",
                    "critical": "150"
                },
                "HPS": {
                    "real": "1.875",
                    "theoretical": "2"
                }
            }
        },
        {
            "name": "desertrat",
            "category": "Pistols",
            "stats": {
                "DPS": {
                    "real": "75",
                    "theoretical": "80",
                    "critical": "315",
                    "theoretical_critical": "336"
                },
                "DPH": {
                    "total": "40",
                    "critical": "200"
                },
                "HPS": {
                    "real": "1.875",
                    "theoretical": "2"
                }
            }
        },
        {
            "name": "chainrevolver",
            "category": "Pistols",
            "stats": {
                "DPS": {
                    "real": "100",
                    "theoretical": "120",
                    "critical": "420",
                    "theoretical_critical": "504"
                },
                "DPH": {
                    "total": "20",
                    "critical": "100"
                },
                "HPS": {
                    "real": "5",
                    "theoretical": "6"
                }
            }
        },
        {
            "name": "serpentsfangs",
            "category": "Pistols",
            "stats": {
                "DPS": {
                    "real": "158.81",
                    "theoretical": "180",
                    "critical": "666.98",
                    "theoretical_critical": "756"
                },
                "DPH": {
                    "total": "45",
                    "critical": "225"
                },
                "HPS": {
                    "real": "3.529",
                    "theoretical": "4"
                }
            }
        },
        {
            "name": "xbetadawncat",
            "category": "Pistols",
            "stats": {
                "DPS": {
                    "real": "5.63",
                    "theoretical": "6",
                    "critical": "23.63",
                    "theoretical_critical": "25.2"
                },
                "DPH": {
                    "total": "3",
                    "critical": "15"
                },
                "HPS": {
                    "real": "1.875",
                    "theoretical": "2"
                }
            }
        },
        {
            "name": "duskenforcer",
            "category": "Pistols",
            "stats": {
                "DPS": {
                    "real": "75",
                    "theoretical": "80",
                    "critical": "315",
                    "theoretical_critical": "336"
                },
                "DPH": {
                    "total": "40",
                    "critical": "200"
                },
                "HPS": {
                    "real": "1.875",
                    "theoretical": "2"
                }
            }
        },
        {
            "name": "xduskenforcer",
            "category": "Pistols",
            "stats": {
                "DPS": {
                    "real": "93.75",
                    "theoretical": "100",
                    "critical": "393.75",
                    "theoretical_critical": "420"
                },
                "DPH": {
                    "total": "50",
                    "critical": "250"
                },
                "HPS": {
                    "real": "1.875",
                    "theoretical": "2"
                }
            }
        },
        {
            "name": "dawnenforcer",
            "category": "Pistols",
            "stats": {
                "DPS": {
                    "real": "112.5",
                    "theoretical": "120",
                    "critical": "472.5",
                    "theoretical_critical": "504"
                },
                "DPH": {
                    "total": "60",
                    "critical": "300"
                },
                "HPS": {
                    "real": "1.875",
                    "theoretical": "2"
                }
            }
        },
        {
            "name": "survivorslock19c",
            "category": "Pistols",
            "stats": {
                "DPS": {
                    "real": "24.38",
                    "theoretical": "26",
                    "critical": "102.38",
                    "theoretical_critical": "109.2"
                },
                "DPH": {
                    "total": "13",
                    "critical": "65"
                },
                "HPS": {
                    "real": "1.875",
                    "theoretical": "2"
                }
            }
        },
        {
            "name": "survivorskolt45",
            "category": "Pistols",
            "stats": {
                "DPS": {
                    "real": "28.58",
                    "theoretical": "30",
                    "critical": "120.04",
                    "theoretical_critical": "126"
                },
                "DPH": {
                    "total": "20",
                    "critical": "100"
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                }
            }
        },
        {
            "name": "prowlerp225",
            "category": "Pistols",
            "stats": {
                "DPS": {
                    "real": "64.31",
                    "theoretical": "67.5",
                    "critical": "270.08",
                    "theoretical_critical": "283.5"
                },
                "DPH": {
                    "total": "45",
                    "critical": "225"
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                }
            }
        },
        {
            "name": "stockingstuffer",
            "category": "Pistols",
            "stats": {
                "DPS": {
                    "real": "314.38",
                    "theoretical": "330",
                    "critical": null,
                    "theoretical_critical": null
                },
                "DPH": {
                    "total": "220",
                    "critical": null
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                }
            }
        },
        {
            "name": "handtalon38",
            "category": "Pistols",
            "stats": {
                "DPS": {
                    "real": "114.32",
                    "theoretical": "120",
                    "critical": "480.14",
                    "theoretical_critical": "504"
                },
                "DPH": {
                    "total": "26.66 x 3",
                    "critical": "133.3 x 3"
                },
                "HPS": {
                    "real": "4.287",
                    "theoretical": "4.5"
                }
            }
        },
        {
            "name": "dealbreaker1858",
            "category": "Pistols",
            "stats": {
                "DPS": {
                    "real": "242.93",
                    "theoretical": "255",
                    "critical": null,
                    "theoretical_critical": null
                },
                "DPH": {
                    "total": "170",
                    "critical": null
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                }
            }
        },
        {
            "name": "dealbreakers1858",
            "category": "Pistols",
            "stats": {
                "DPS": {
                    "real": "463.59",
                    "theoretical": "510",
                    "critical": null,
                    "theoretical_critical": null
                },
                "DPH": {
                    "total": "170",
                    "critical": null
                },
                "HPS": {
                    "real": "2.727",
                    "theoretical": "3"
                }
            }
        },
        {
            "name": "wildcard1851",
            "category": "Pistols",
            "stats": {
                "DPS": {
                    "real": "56.25",
                    "theoretical": "60",
                    "critical": "236.25",
                    "theoretical_critical": "252"
                },
                "DPH": {
                    "total": "30",
                    "critical": "150"
                },
                "HPS": {
                    "real": "1.875",
                    "theoretical": "2"
                }
            }
        },
        {
            "name": "wildcards1851",
            "category": "Pistols",
            "stats": {
                "DPS": {
                    "real": "94.75",
                    "theoretical": "105.88",
                    "critical": "397.96",
                    "theoretical_critical": "444.71"
                },
                "DPH": {
                    "total": "30",
                    "critical": "150"
                },
                "HPS": {
                    "real": "3.158",
                    "theoretical": "3.529"
                }
            }
        },
        {
            "name": "betarx4",
            "category": "Rifles",
            "stats": {
                "DPS": {
                    "real": "11.62",
                    "theoretical": "12",
                    "critical": "48.79",
                    "theoretical_critical": "50.4"
                },
                "DPH": {
                    "total": "12",
                    "critical": "60"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                }
            }
        },
        {
            "name": "mini41",
            "category": "Rifles",
            "stats": {
                "DPS": {
                    "real": "12.58",
                    "theoretical": "13",
                    "critical": "52.85",
                    "theoretical_critical": "54.6"
                },
                "DPH": {
                    "total": "13",
                    "critical": "65"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                }
            }
        },
        {
            "name": "sl8",
            "category": "Rifles",
            "stats": {
                "DPS": {
                    "real": "13.55",
                    "theoretical": "14",
                    "critical": "56.92",
                    "theoretical_critical": "58.8"
                },
                "DPH": {
                    "total": "14",
                    "critical": "70"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                }
            }
        },
        {
            "name": "henryfield",
            "category": "Rifles",
            "stats": {
                "DPS": {
                    "real": "14.79",
                    "theoretical": "15",
                    "critical": "62.12",
                    "theoretical_critical": "63"
                },
                "DPH": {
                    "total": "15",
                    "critical": "75"
                },
                "HPS": {
                    "real": "0.986",
                    "theoretical": "1"
                }
            }
        },
        {
            "name": "m24",
            "category": "Rifles",
            "stats": {
                "DPS": {
                    "real": "15.49",
                    "theoretical": "16",
                    "critical": "65.05",
                    "theoretical_critical": "67.2"
                },
                "DPH": {
                    "total": "16",
                    "critical": "80"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                }
            }
        },
        {
            "name": "huntsmanxp12",
            "category": "Rifles",
            "stats": {
                "DPS": {
                    "real": "17.42",
                    "theoretical": "18",
                    "critical": "73.18",
                    "theoretical_critical": "75.6"
                },
                "DPH": {
                    "total": "18",
                    "critical": "90"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                }
            }
        },
        {
            "name": "m1garand",
            "category": "Rifles",
            "stats": {
                "DPS": {
                    "real": "17.42",
                    "theoretical": "18",
                    "critical": "73.18",
                    "theoretical_critical": "75.6"
                },
                "DPH": {
                    "total": "18",
                    "critical": "90"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                }
            }
        },
        {
            "name": "chesterfield",
            "category": "Rifles",
            "stats": {
                "DPS": {
                    "real": "18.39",
                    "theoretical": "19",
                    "critical": "77.25",
                    "theoretical_critical": "79.8"
                },
                "DPH": {
                    "total": "19",
                    "critical": "95"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                }
            }
        },
        {
            "name": "glacialwarfare",
            "category": "Rifles",
            "stats": {
                "DPS": {
                    "real": "19.36",
                    "theoretical": "20",
                    "critical": "81.31",
                    "theoretical_critical": "84"
                },
                "DPH": {
                    "total": "20",
                    "critical": "100"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                }
            }
        },
        {
            "name": "makeshiftrifle",
            "category": "Rifles",
            "stats": {
                "DPS": {
                    "real": "20.33",
                    "theoretical": "21",
                    "critical": "85.38",
                    "theoretical_critical": "88.2"
                },
                "DPH": {
                    "total": "21",
                    "critical": "105"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                }
            }
        },
        {
            "name": "m21",
            "category": "Rifles",
            "stats": {
                "DPS": {
                    "real": "20.33",
                    "theoretical": "21",
                    "critical": "85.38",
                    "theoretical_critical": "88.2"
                },
                "DPH": {
                    "total": "21",
                    "critical": "105"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                }
            }
        },
        {
            "name": "msg9",
            "category": "Rifles",
            "stats": {
                "DPS": {
                    "real": "21.3",
                    "theoretical": "22",
                    "critical": "89.44",
                    "theoretical_critical": "92.4"
                },
                "DPH": {
                    "total": "22",
                    "critical": "110"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                }
            }
        },
        {
            "name": "marksmanmx90",
            "category": "Rifles",
            "stats": {
                "DPS": {
                    "real": "23.23",
                    "theoretical": "24",
                    "critical": "97.57",
                    "theoretical_critical": "100.8"
                },
                "DPH": {
                    "total": "24",
                    "critical": "120"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                }
            }
        },
        {
            "name": "alphajudge",
            "category": "Rifles",
            "stats": {
                "DPS": {
                    "real": "34.3",
                    "theoretical": "36",
                    "critical": "144.04",
                    "theoretical_critical": "151.2"
                },
                "DPH": {
                    "total": "24",
                    "critical": "120"
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                }
            }
        },
        {
            "name": "sic550",
            "category": "Rifles",
            "stats": {
                "DPS": {
                    "real": "24.29",
                    "theoretical": "25.5",
                    "critical": "102.03",
                    "theoretical_critical": "107.1"
                },
                "DPH": {
                    "total": "17",
                    "critical": "85"
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                }
            }
        },
        {
            "name": "hawkop96",
            "category": "Rifles",
            "stats": {
                "DPS": {
                    "real": "25.17",
                    "theoretical": "26",
                    "critical": "105.71",
                    "theoretical_critical": "109.2"
                },
                "DPH": {
                    "total": "26",
                    "critical": "130"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                }
            }
        },
        {
            "name": "dragonsvd",
            "category": "Rifles",
            "stats": {
                "DPS": {
                    "real": "27.15",
                    "theoretical": "28.5",
                    "critical": "114.03",
                    "theoretical_critical": "119.7"
                },
                "DPH": {
                    "total": "19",
                    "critical": "95"
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                }
            }
        },
        {
            "name": "ashensrsa1",
            "category": "Rifles",
            "stats": {
                "DPS": {
                    "real": "30.01",
                    "theoretical": "31.5",
                    "critical": "126.04",
                    "theoretical_critical": "132.3"
                },
                "DPH": {
                    "total": "21",
                    "critical": "105"
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                }
            }
        },
        {
            "name": "m82a2",
            "category": "Rifles",
            "stats": {
                "DPS": {
                    "real": "29.04",
                    "theoretical": "30",
                    "critical": "121.97",
                    "theoretical_critical": "126"
                },
                "DPH": {
                    "total": "30",
                    "critical": "150"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                }
            }
        },
        {
            "name": "vssvintorez",
            "category": "Rifles",
            "stats": {
                "DPS": {
                    "real": "31.44",
                    "theoretical": "33",
                    "critical": "132.04",
                    "theoretical_critical": "138.6"
                },
                "DPH": {
                    "total": "22",
                    "critical": "110"
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                }
            }
        },
        {
            "name": "577rex",
            "category": "Rifles",
            "stats": {
                "DPS": {
                    "real": "38.72",
                    "theoretical": "40",
                    "critical": "162.62",
                    "theoretical_critical": "168"
                },
                "DPH": {
                    "total": "40",
                    "critical": "200"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                }
            }
        },
        {
            "name": "ironsight33f",
            "category": "Rifles",
            "stats": {
                "DPS": {
                    "real": "48.4",
                    "theoretical": "50",
                    "critical": "203.28",
                    "theoretical_critical": "210"
                },
                "DPH": {
                    "total": "50",
                    "critical": "250"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                }
            }
        },
        {
            "name": "pierceshot33p",
            "category": "Rifles",
            "stats": {
                "DPS": {
                    "real": "67.76",
                    "theoretical": "70",
                    "critical": "284.59",
                    "theoretical_critical": "294"
                },
                "DPH": {
                    "total": "56 + 14 = 70",
                    "critical": "280 + 70 = 350"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                }
            }
        },
        {
            "name": "worgcarbine",
            "category": "Rifles",
            "stats": {
                "DPS": {
                    "real": "65.63",
                    "theoretical": "70",
                    "critical": "275.63",
                    "theoretical_critical": "294"
                },
                "DPH": {
                    "total": "35",
                    "critical": "175"
                },
                "HPS": {
                    "real": "1.875",
                    "theoretical": "2"
                }
            }
        },
        {
            "name": "xgarand",
            "category": "Rifles",
            "stats": {
                "DPS": {
                    "real": "87.12",
                    "theoretical": "90",
                    "critical": "365.9",
                    "theoretical_critical": "378"
                },
                "DPH": {
                    "total": "90",
                    "critical": "450"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                }
            }
        },
        {
            "name": "xgarand14mm",
            "category": "Rifles",
            "stats": {
                "DPS": {
                    "real": "87.12",
                    "theoretical": "90",
                    "critical": "365.9",
                    "theoretical_critical": "378"
                },
                "DPH": {
                    "total": "90",
                    "critical": "450"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                }
            }
        },
        {
            "name": "rusthound37e",
            "category": "Rifles",
            "stats": {
                "DPS": {
                    "real": "96.8",
                    "theoretical": "100",
                    "critical": "406.56",
                    "theoretical_critical": "420"
                },
                "DPH": {
                    "total": "100",
                    "critical": "500"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                }
            }
        },
        {
            "name": "nighthawkyj4",
            "category": "Rifles",
            "stats": {
                "DPS": {
                    "real": "114.32",
                    "theoretical": "120",
                    "critical": "480.14",
                    "theoretical_critical": "504"
                },
                "DPH": {
                    "total": "80",
                    "critical": "400"
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                }
            }
        },
        {
            "name": "vindicatorm50",
            "category": "Rifles",
            "stats": {
                "DPS": {
                    "real": "154.88",
                    "theoretical": "160",
                    "critical": "650.5",
                    "theoretical_critical": "672"
                },
                "DPH": {
                    "total": "96 + 32 + 32 = 160",
                    "critical": "480 + 160 + 160 = 800"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                }
            }
        },
        {
            "name": "rebellion",
            "category": "Rifles",
            "stats": {
                "DPS": {
                    "real": "85.74",
                    "theoretical": "90",
                    "critical": "360.11",
                    "theoretical_critical": "378"
                },
                "DPH": {
                    "total": "60",
                    "critical": "300"
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                }
            }
        },
        {
            "name": "corpsepiercer",
            "category": "Rifles",
            "stats": {
                "DPS": {
                    "real": "43.56",
                    "theoretical": "45",
                    "critical": "182.95",
                    "theoretical_critical": "189"
                },
                "DPH": {
                    "total": "45",
                    "critical": "225"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                }
            }
        },
        {
            "name": "marksmang8",
            "category": "Rifles",
            "stats": {
                "DPS": {
                    "real": "64.31",
                    "theoretical": "67.5",
                    "critical": "270.08",
                    "theoretical_critical": "283.5"
                },
                "DPH": {
                    "total": "45",
                    "critical": "225"
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                }
            }
        },
        {
            "name": "longshotpp10",
            "category": "Rifles",
            "stats": {
                "DPS": {
                    "real": "77.44",
                    "theoretical": "80",
                    "critical": "325.25",
                    "theoretical_critical": "336"
                },
                "DPH": {
                    "total": "80",
                    "critical": "400"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                }
            }
        },
        {
            "name": "torchbolt",
            "category": "Rifles",
            "stats": {
                "DPS": {
                    "real": "112.5",
                    "theoretical": "120",
                    "critical": "472.5",
                    "theoretical_critical": "504"
                },
                "DPH": {
                    "total": "60",
                    "critical": "300"
                },
                "HPS": {
                    "real": "1.875",
                    "theoretical": "2"
                }
            }
        },
        {
            "name": "barnellrf31crossbow",
            "category": "Rifles",
            "stats": {
                "DPS": {
                    "real": "110.35",
                    "theoretical": "114",
                    "critical": "463.48",
                    "theoretical_critical": "478.8"
                },
                "DPH": {
                    "total": "114",
                    "critical": "570"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                }
            }
        },
        {
            "name": "hailstormc12",
            "category": "Rifles",
            "stats": {
                "DPS": {
                    "real": "97.77",
                    "theoretical": "101",
                    "critical": "410.63",
                    "theoretical_critical": "424.2"
                },
                "DPH": {
                    "total": "12.12 + 28.28 + 60.6 = 101",
                    "critical": "60.6 + 141.4 + 303 = 505"
                },
                "HPS": {
                    "real": "2.904",
                    "theoretical": "3"
                }
            }
        },
        {
            "name": "impalercrossbow",
            "category": "Rifles",
            "stats": {
                "DPS": {
                    "real": "112.5",
                    "theoretical": "120",
                    "critical": "472.5",
                    "theoretical_critical": "504"
                },
                "DPH": {
                    "total": "15 x 4 = 60",
                    "critical": "75 x 4 = 300"
                },
                "HPS": {
                    "real": "7.5",
                    "theoretical": "8"
                }
            }
        },
        {
            "name": "fleshseeker",
            "category": "Rifles",
            "stats": {
                "DPS": {
                    "real": "178.13",
                    "theoretical": "190",
                    "critical": "748.13",
                    "theoretical_critical": "798"
                },
                "DPH": {
                    "total": "76 + 9.5 + 9.5 = 95",
                    "critical": "380 + 47.5 + 47.5 = 475"
                },
                "HPS": {
                    "real": "1.875",
                    "theoretical": "2"
                }
            }
        },
        {
            "name": "xr2magstorm",
            "category": "Rifles",
            "stats": {
                "DPS": {
                    "real": "750",
                    "theoretical": "769",
                    "critical": null,
                    "theoretical_critical": null
                },
                "DPH": {
                    "total": "1000",
                    "critical": null
                },
                "HPS": {
                    "real": "0.75",
                    "theoretical": "0.769"
                }
            }
        },
        {
            "name": "duskcarbine",
            "category": "Rifles",
            "stats": {
                "DPS": {
                    "real": "85.74",
                    "theoretical": "90",
                    "critical": "360.11",
                    "theoretical_critical": "378"
                },
                "DPH": {
                    "total": "60",
                    "critical": "300"
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                }
            }
        },
        {
            "name": "xduskcarbine",
            "category": "Rifles",
            "stats": {
                "DPS": {
                    "real": "100.03",
                    "theoretical": "105",
                    "critical": "420.13",
                    "theoretical_critical": "441"
                },
                "DPH": {
                    "total": "70",
                    "critical": "350"
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                }
            }
        },
        {
            "name": "dawncarbine",
            "category": "Rifles",
            "stats": {
                "DPS": {
                    "real": "114.32",
                    "theoretical": "120",
                    "critical": "480.14",
                    "theoretical_critical": "504"
                },
                "DPH": {
                    "total": "80",
                    "critical": "400"
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                }
            }
        },
        {
            "name": "wolfsbaneleveraction",
            "category": "Rifles",
            "stats": {
                "DPS": {
                    "real": "78.75",
                    "theoretical": "84",
                    "critical": "330.75",
                    "theoretical_critical": "352.8"
                },
                "DPH": {
                    "total": "42",
                    "critical": "210"
                },
                "HPS": {
                    "real": "1.875",
                    "theoretical": "2"
                }
            }
        },
        {
            "name": "frostshotfx50",
            "category": "Rifles",
            "stats": {
                "DPS": {
                    "real": "73.57",
                    "theoretical": "76",
                    "critical": "308.99",
                    "theoretical_critical": "319.2"
                },
                "DPH": {
                    "total": "76",
                    "critical": "380"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                }
            }
        },
        {
            "name": "577widow",
            "category": "Rifles",
            "stats": {
                "DPS": {
                    "real": "64.31",
                    "theoretical": "67.5",
                    "critical": "270.08",
                    "theoretical_critical": "283.5"
                },
                "DPH": {
                    "total": "45",
                    "critical": "225"
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                }
            }
        },
        {
            "name": "xr1pulserifle",
            "category": "Rifles",
            "stats": {
                "DPS": {
                    "real": "93.75",
                    "theoretical": "100",
                    "critical": "393.75",
                    "theoretical_critical": "420"
                },
                "DPH": {
                    "total": "25 + 25",
                    "critical": "125 + 125"
                },
                "HPS": {
                    "real": "3.75",
                    "theoretical": "4"
                }
            }
        },
        {
            "name": "ecohc150",
            "category": "Chainsaws",
            "stats": {
                "DPS": {
                    "real": "13.33",
                    "theoretical": "17.14",
                    "critical": "56.01",
                    "theoretical_critical": "72"
                },
                "DPH": {
                    "total": "2",
                    "critical": "10"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                },
                "Melee Range": {
                    "range": "1.5",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "riptidemarinepro",
            "category": "Chainsaws",
            "stats": {
                "DPS": {
                    "real": "20",
                    "theoretical": "25.71",
                    "critical": "84.01",
                    "theoretical_critical": "108"
                },
                "DPH": {
                    "total": "3",
                    "critical": "15"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                },
                "Melee Range": {
                    "range": "1.5",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "dilmarps",
            "category": "Chainsaws",
            "stats": {
                "DPS": {
                    "real": "20",
                    "theoretical": "25.71",
                    "critical": "84.01",
                    "theoretical_critical": "108"
                },
                "DPH": {
                    "total": "3",
                    "critical": "15"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                },
                "Melee Range": {
                    "range": "1.5",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "makeshiftchainsaw",
            "category": "Chainsaws",
            "stats": {
                "DPS": {
                    "real": "23.34",
                    "theoretical": "30",
                    "critical": "98.01",
                    "theoretical_critical": "126"
                },
                "DPH": {
                    "total": "3.5",
                    "critical": "17.5"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                },
                "Melee Range": {
                    "range": "1.5",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "ronanpro",
            "category": "Chainsaws",
            "stats": {
                "DPS": {
                    "real": "26.67",
                    "theoretical": "34.29",
                    "critical": "112.01",
                    "theoretical_critical": "144"
                },
                "DPH": {
                    "total": "4",
                    "critical": "20"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                },
                "Melee Range": {
                    "range": "1.5",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "lumberjackgg6",
            "category": "Chainsaws",
            "stats": {
                "DPS": {
                    "real": "33.34",
                    "theoretical": "42.86",
                    "critical": "140.01",
                    "theoretical_critical": "180"
                },
                "DPH": {
                    "total": "5",
                    "critical": "25"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                },
                "Melee Range": {
                    "range": "1.5",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "steelms800",
            "category": "Chainsaws",
            "stats": {
                "DPS": {
                    "real": "33.34",
                    "theoretical": "42.86",
                    "critical": "140.01",
                    "theoretical_critical": "180"
                },
                "DPH": {
                    "total": "5",
                    "critical": "25"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                },
                "Melee Range": {
                    "range": "1.5",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "tyrantt220",
            "category": "Chainsaws",
            "stats": {
                "DPS": {
                    "real": "36.67",
                    "theoretical": "47.14",
                    "critical": "154.02",
                    "theoretical_critical": "198"
                },
                "DPH": {
                    "total": "5.5",
                    "critical": "27.5"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                },
                "Melee Range": {
                    "range": "1.5",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "grinder",
            "category": "Chainsaws",
            "stats": {
                "DPS": {
                    "real": "46.66",
                    "theoretical": "59.99",
                    "critical": "196",
                    "theoretical_critical": "251.98"
                },
                "DPH": {
                    "total": "7",
                    "critical": "35"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                },
                "Melee Range": {
                    "range": "1.5",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "steel090",
            "category": "Chainsaws",
            "stats": {
                "DPS": {
                    "real": "53.33",
                    "theoretical": "68.56",
                    "critical": "224.01",
                    "theoretical_critical": "287.98"
                },
                "DPH": {
                    "total": "8",
                    "critical": "40"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                },
                "Melee Range": {
                    "range": "2",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "ripsawg12",
            "category": "Chainsaws",
            "stats": {
                "DPS": {
                    "real": "66.67",
                    "theoretical": "85.71",
                    "critical": "280.01",
                    "theoretical_critical": "359.98"
                },
                "DPH": {
                    "total": "10",
                    "critical": "50"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                },
                "Melee Range": {
                    "range": "1.85",
                    "cleave_width": "1.15"
                }
            }
        },
        {
            "name": "mutilatorg12",
            "category": "Chainsaws",
            "stats": {
                "DPS": {
                    "real": "86.68",
                    "theoretical": "111.43",
                    "critical": "364.04",
                    "theoretical_critical": "468"
                },
                "DPH": {
                    "total": "13",
                    "critical": "65"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                },
                "Melee Range": {
                    "range": "1.85",
                    "cleave_width": "1.15"
                }
            }
        },
        {
            "name": "goretooth44g",
            "category": "Chainsaws",
            "stats": {
                "DPS": {
                    "real": "90",
                    "theoretical": "115.70",
                    "critical": "378.02",
                    "theoretical_critical": "485.98"
                },
                "DPH": {
                    "total": "13.5",
                    "critical": "67.5"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                },
                "Melee Range": {
                    "range": "2",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "sharktoothripper",
            "category": "Chainsaws",
            "stats": {
                "DPS": {
                    "real": "100",
                    "theoretical": "128.56",
                    "critical": "420.02",
                    "theoretical_critical": "539.97"
                },
                "DPH": {
                    "total": "15",
                    "critical": "75"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                },
                "Melee Range": {
                    "range": "2",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "fleshreaver",
            "category": "Chainsaws",
            "stats": {
                "DPS": {
                    "real": "133.34",
                    "theoretical": "171.42",
                    "critical": "560.02",
                    "theoretical_critical": "719.96"
                },
                "DPH": {
                    "total": "20",
                    "critical": "100"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                },
                "Melee Range": {
                    "range": "3.2",
                    "cleave_width": "1.4"
                }
            }
        },
        {
            "name": "corpsegrinder",
            "category": "Chainsaws",
            "stats": {
                "DPS": {
                    "real": "60",
                    "theoretical": "77.13",
                    "critical": "252.01",
                    "theoretical_critical": "323.98"
                },
                "DPH": {
                    "total": "9",
                    "critical": "45"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                },
                "Melee Range": {
                    "range": "2",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "buzzbladern8",
            "category": "Chainsaws",
            "stats": {
                "DPS": {
                    "real": "80",
                    "theoretical": "102.85",
                    "critical": "336.01",
                    "theoretical_critical": "431.97"
                },
                "DPH": {
                    "total": "12",
                    "critical": "60"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                },
                "Melee Range": {
                    "range": "2",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "grinderx3",
            "category": "Chainsaws",
            "stats": {
                "DPS": {
                    "real": "93.33",
                    "theoretical": "119.99",
                    "critical": "392.02",
                    "theoretical_critical": "503.97"
                },
                "DPH": {
                    "total": "14",
                    "critical": "70"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                },
                "Melee Range": {
                    "range": "1.75",
                    "cleave_width": "1.25"
                }
            }
        },
        {
            "name": "haresplitter",
            "category": "Chainsaws",
            "stats": {
                "DPS": {
                    "real": "102.85",
                    "theoretical": "144",
                    "critical": "431.98",
                    "theoretical_critical": "604.8"
                },
                "DPH": {
                    "total": "12",
                    "critical": "60"
                },
                "HPS": {
                    "real": "8.571",
                    "theoretical": "12"
                },
                "Melee Range": {
                    "range": "2",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "dusksaw",
            "category": "Chainsaws",
            "stats": {
                "DPS": {
                    "real": "90",
                    "theoretical": "115.70",
                    "critical": "378.01",
                    "theoretical_critical": "485.97"
                },
                "DPH": {
                    "total": "13.5",
                    "critical": "67.5"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                },
                "Melee Range": {
                    "range": "2",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "xdusksaw",
            "category": "Chainsaws",
            "stats": {
                "DPS": {
                    "real": "100.01",
                    "theoretical": "128.57",
                    "critical": "420.04",
                    "theoretical_critical": "540"
                },
                "DPH": {
                    "total": "15",
                    "critical": "75"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                },
                "Melee Range": {
                    "range": "2",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "dawnsaw",
            "category": "Chainsaws",
            "stats": {
                "DPS": {
                    "real": "120",
                    "theoretical": "154.27",
                    "critical": "504.02",
                    "theoretical_critical": "647.96"
                },
                "DPH": {
                    "total": "18",
                    "critical": "90"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                },
                "Melee Range": {
                    "range": "2.5",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "survivorschainsaw",
            "category": "Chainsaws",
            "stats": {
                "DPS": {
                    "real": "40.01",
                    "theoretical": "51.43",
                    "critical": "168.02",
                    "theoretical_critical": "216"
                },
                "DPH": {
                    "total": "6",
                    "critical": "30"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                },
                "Melee Range": {
                    "range": "1.5",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "pumpkincarver",
            "category": "Chainsaws",
            "stats": {
                "DPS": {
                    "real": "90.01",
                    "theoretical": "115.71",
                    "critical": "378.04",
                    "theoretical_critical": "486"
                },
                "DPH": {
                    "total": "13.5",
                    "critical": "67.5"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                },
                "Melee Range": {
                    "range": "1.5",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "butchersaw",
            "category": "Chainsaws",
            "stats": {
                "DPS": {
                    "real": "93.34",
                    "theoretical": "120",
                    "critical": "392.04",
                    "theoretical_critical": "504"
                },
                "DPH": {
                    "total": "14",
                    "critical": "70"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                },
                "Melee Range": {
                    "range": "2.5",
                    "cleave_width": "1.4"
                }
            }
        },
        {
            "name": "mancinim1",
            "category": "Shotguns",
            "stats": {
                "DPS": {
                    "real": "28.58",
                    "theoretical": "30",
                    "critical": null,
                    "theoretical_critical": null
                },
                "DPH": {
                    "total": "2.5 x 8 = 20",
                    "critical": null
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                }
            }
        },
        {
            "name": "highlander",
            "category": "Shotguns",
            "stats": {
                "DPS": {
                    "real": "51.44",
                    "theoretical": "54",
                    "critical": null,
                    "theoretical_critical": null
                },
                "DPH": {
                    "total": "4.5 x 8 = 36",
                    "critical": null
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                }
            }
        },
        {
            "name": "washington870",
            "category": "Shotguns",
            "stats": {
                "DPS": {
                    "real": "40.01",
                    "theoretical": "42",
                    "critical": null,
                    "theoretical_critical": null
                },
                "DPH": {
                    "total": "3.5 x 8 = 28",
                    "critical": null
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                }
            }
        },
        {
            "name": "washington1100",
            "category": "Shotguns",
            "stats": {
                "DPS": {
                    "real": "57.16",
                    "theoretical": "60",
                    "critical": null,
                    "theoretical_critical": null
                },
                "DPH": {
                    "total": "5 x 8 = 40",
                    "critical": null
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                }
            }
        },
        {
            "name": "doubletapd16",
            "category": "Shotguns",
            "stats": {
                "DPS": {
                    "real": "80.02",
                    "theoretical": "84",
                    "critical": null,
                    "theoretical_critical": null
                },
                "DPH": {
                    "total": "4 x 14 = 56",
                    "critical": null
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                }
            }
        },
        {
            "name": "chester1300",
            "category": "Shotguns",
            "stats": {
                "DPS": {
                    "real": "68.59",
                    "theoretical": "72",
                    "critical": null,
                    "theoretical_critical": null
                },
                "DPH": {
                    "total": "6 x 8 = 48",
                    "critical": null
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                }
            }
        },
        {
            "name": "wall500",
            "category": "Shotguns",
            "stats": {
                "DPS": {
                    "real": "80.02",
                    "theoretical": "84",
                    "critical": null,
                    "theoretical_critical": null
                },
                "DPH": {
                    "total": "7 x 8 = 56",
                    "critical": null
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                }
            }
        },
        {
            "name": "slamfires4compact",
            "category": "Shotguns",
            "stats": {
                "DPS": {
                    "real": "142.5",
                    "theoretical": "152",
                    "critical": null,
                    "theoretical_critical": null
                },
                "DPH": {
                    "total": "9.5 x 8 = 76",
                    "critical": null
                },
                "HPS": {
                    "real": "1.875",
                    "theoretical": "2"
                }
            }
        },
        {
            "name": "sega20",
            "category": "Shotguns",
            "stats": {
                "DPS": {
                    "real": "90",
                    "theoretical": "96",
                    "critical": null,
                    "theoretical_critical": null
                },
                "DPH": {
                    "total": "6 x 8 = 48",
                    "critical": null
                },
                "HPS": {
                    "real": "1.875",
                    "theoretical": "2"
                }
            }
        },
        {
            "name": "spsa12",
            "category": "Shotguns",
            "stats": {
                "DPS": {
                    "real": "114.32",
                    "theoretical": "120",
                    "critical": null,
                    "theoretical_critical": null
                },
                "DPH": {
                    "total": "10 x 8 = 80",
                    "critical": null
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                }
            }
        },
        {
            "name": "makeshiftshotgun",
            "category": "Shotguns",
            "stats": {
                "DPS": {
                    "real": "114.32",
                    "theoretical": "120",
                    "critical": null,
                    "theoretical_critical": null
                },
                "DPH": {
                    "total": "10 x 8 = 80",
                    "critical": null
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                }
            }
        },
        {
            "name": "mannberg500",
            "category": "Shotguns",
            "stats": {
                "DPS": {
                    "real": "125.75",
                    "theoretical": "132",
                    "critical": null,
                    "theoretical_critical": null
                },
                "DPH": {
                    "total": "11 x 8 = 88",
                    "critical": null
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                }
            }
        },
        {
            "name": "tripledefender",
            "category": "Shotguns",
            "stats": {
                "DPS": {
                    "real": "157.5",
                    "theoretical": "168",
                    "critical": null,
                    "theoretical_critical": null
                },
                "DPH": {
                    "total": "6 x 14 = 84",
                    "critical": null
                },
                "HPS": {
                    "real": "1.875",
                    "theoretical": "2"
                }
            }
        },
        {
            "name": "sweeper",
            "category": "Shotguns",
            "stats": {
                "DPS": {
                    "real": "135",
                    "theoretical": "144",
                    "critical": null,
                    "theoretical_critical": null
                },
                "DPH": {
                    "total": "9 x 8 = 72",
                    "critical": null
                },
                "HPS": {
                    "real": "1.875",
                    "theoretical": "2"
                }
            }
        },
        {
            "name": "terminatortx12",
            "category": "Shotguns",
            "stats": {
                "DPS": {
                    "real": "151.88",
                    "theoretical": "162",
                    "critical": null,
                    "theoretical_critical": null
                },
                "DPH": {
                    "total": "9 x 9 = 81",
                    "critical": null
                },
                "HPS": {
                    "real": "1.875",
                    "theoretical": "2"
                }
            }
        },
        {
            "name": "vp12",
            "category": "Shotguns",
            "stats": {
                "DPS": {
                    "real": "151.88",
                    "theoretical": "162",
                    "critical": null,
                    "theoretical_critical": null
                },
                "DPH": {
                    "total": "9 x 9 = 81",
                    "critical": null
                },
                "HPS": {
                    "real": "1.875",
                    "theoretical": "2"
                }
            }
        },
        {
            "name": "usan12",
            "category": "Shotguns",
            "stats": {
                "DPS": {
                    "real": "185.44",
                    "theoretical": "204",
                    "critical": null,
                    "theoretical_critical": null
                },
                "DPH": {
                    "total": "8.5 x 8 = 68",
                    "critical": null
                },
                "HPS": {
                    "real": "2.727",
                    "theoretical": "3"
                }
            }
        },
        {
            "name": "aa12",
            "category": "Shotguns",
            "stats": {
                "DPS": {
                    "real": "229.07",
                    "theoretical": "252",
                    "critical": null,
                    "theoretical_critical": null
                },
                "DPH": {
                    "total": "10.5 x 8 = 84",
                    "critical": null
                },
                "HPS": {
                    "real": "2.727",
                    "theoretical": "3"
                }
            }
        },
        {
            "name": "painshot10",
            "category": "Shotguns",
            "stats": {
                "DPS": {
                    "real": "291.52",
                    "theoretical": "306",
                    "critical": null,
                    "theoretical_critical": null
                },
                "DPH": {
                    "total": "17 x 12 = 204",
                    "critical": null
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                }
            }
        },
        {
            "name": "scourgeshot10",
            "category": "Shotguns",
            "stats": {
                "DPS": {
                    "real": "411.55",
                    "theoretical": "432",
                    "critical": null,
                    "theoretical_critical": null
                },
                "DPH": {
                    "total": "[14.4 + 3.6] x 16 = 288",
                    "critical": null
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                }
            }
        },
        {
            "name": "acebarrelgz3",
            "category": "Shotguns",
            "stats": {
                "DPS": {
                    "real": "360.11",
                    "theoretical": "378",
                    "critical": null,
                    "theoretical_critical": null
                },
                "DPH": {
                    "total": "21 x 12 = 252",
                    "critical": null
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                }
            }
        },
        {
            "name": "jackhammer10g",
            "category": "Shotguns",
            "stats": {
                "DPS": {
                    "real": "414.5",
                    "theoretical": "456",
                    "critical": null,
                    "theoretical_critical": null
                },
                "DPH": {
                    "total": "19 x 8 = 152",
                    "critical": null
                },
                "HPS": {
                    "real": "2.727",
                    "theoretical": "3"
                }
            }
        },
        {
            "name": "xmannberg",
            "category": "Shotguns",
            "stats": {
                "DPS": {
                    "real": "468.75",
                    "theoretical": "500",
                    "critical": null,
                    "theoretical_critical": null
                },
                "DPH": {
                    "total": "25 x 10 = 250",
                    "critical": null
                },
                "HPS": {
                    "real": "1.875",
                    "theoretical": "2.0"
                }
            }
        },
        {
            "name": "xmannberg10g",
            "category": "Shotguns",
            "stats": {
                "DPS": {
                    "real": "468.75",
                    "theoretical": "500",
                    "critical": null,
                    "theoretical_critical": null
                },
                "DPH": {
                    "total": "25 x 10 = 250",
                    "critical": null
                },
                "HPS": {
                    "real": "1.875",
                    "theoretical": "2.0"
                }
            }
        },
        {
            "name": "gawbl1n",
            "category": "Shotguns",
            "stats": {
                "DPS": {
                    "real": "540",
                    "theoretical": "576",
                    "critical": null,
                    "theoretical_critical": null
                },
                "DPH": {
                    "total": "16 x 18 = 288",
                    "critical": null
                },
                "HPS": {
                    "real": "1.875",
                    "theoretical": "2"
                }
            }
        },
        {
            "name": "breacher730",
            "category": "Shotguns",
            "stats": {
                "DPS": {
                    "real": "562.5",
                    "theoretical": "600",
                    "critical": null,
                    "theoretical_critical": null
                },
                "DPH": {
                    "total": "[42 + 12 + 6] x 5 = 300",
                    "critical": null
                },
                "HPS": {
                    "real": "1.875",
                    "theoretical": "2"
                }
            }
        },
        {
            "name": "cyclonex150",
            "category": "Shotguns",
            "stats": {
                "DPS": {
                    "real": "589.03",
                    "theoretical": "648",
                    "critical": null,
                    "theoretical_critical": null
                },
                "DPH": {
                    "total": "[12 x 9] x 2 = 216",
                    "critical": null
                },
                "HPS": {
                    "real": "5.454",
                    "theoretical": "6"
                }
            }
        },
        {
            "name": "corpseblaster",
            "category": "Shotguns",
            "stats": {
                "DPS": {
                    "real": "214.35",
                    "theoretical": "225",
                    "critical": null,
                    "theoretical_critical": null
                },
                "DPH": {
                    "total": "10 x 15 = 150",
                    "critical": null
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                }
            }
        },
        {
            "name": "biforcec7",
            "category": "Shotguns",
            "stats": {
                "DPS": {
                    "real": "390",
                    "theoretical": "416",
                    "critical": null,
                    "theoretical_critical": null
                },
                "DPH": {
                    "total": "16 x 13 = 208",
                    "critical": null
                },
                "HPS": {
                    "real": "1.875",
                    "theoretical": "2"
                }
            }
        },
        {
            "name": "bucktoothblaster",
            "category": "Shotguns",
            "stats": {
                "DPS": {
                    "real": "514.44",
                    "theoretical": "540",
                    "critical": null,
                    "theoretical_critical": null
                },
                "DPH": {
                    "total": "12 x 30 = 360",
                    "critical": null
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                }
            }
        },
        {
            "name": "chimneysweeper",
            "category": "Shotguns",
            "stats": {
                "DPS": {
                    "real": "450",
                    "theoretical": "480",
                    "critical": null,
                    "theoretical_critical": null
                },
                "DPH": {
                    "total": "12 x 20 = 240",
                    "critical": null
                },
                "HPS": {
                    "real": "1.875",
                    "theoretical": "2"
                }
            }
        },
        {
            "name": "buckblast99a",
            "category": "Shotguns",
            "stats": {
                "DPS": {
                    "real": "458.14",
                    "theoretical": "504",
                    "critical": null,
                    "theoretical_critical": null
                },
                "DPH": {
                    "total": "14 x 12 = 168",
                    "critical": null
                },
                "HPS": {
                    "real": "2.727",
                    "theoretical": "3"
                }
            }
        },
        {
            "name": "commander10",
            "category": "Shotguns",
            "stats": {
                "DPS": {
                    "real": "502.88",
                    "theoretical": "570",
                    "critical": null,
                    "theoretical_critical": null
                },
                "DPH": {
                    "total": "9.5 x 15 = 142.5",
                    "critical": null
                },
                "HPS": {
                    "real": "3.529",
                    "theoretical": "4"
                }
            }
        },
        {
            "name": "clawshot16",
            "category": "Shotguns",
            "stats": {
                "DPS": {
                    "real": "562.5",
                    "theoretical": "600",
                    "critical": null,
                    "theoretical_critical": null
                },
                "DPH": {
                    "total": "15 x 20 = 300",
                    "critical": null
                },
                "HPS": {
                    "real": "1.875",
                    "theoretical": "2"
                }
            }
        },
        {
            "name": "duskstriker",
            "category": "Shotguns",
            "stats": {
                "DPS": {
                    "real": "349.06",
                    "theoretical": "384",
                    "critical": null,
                    "theoretical_critical": null
                },
                "DPH": {
                    "total": "16 x 8 = 128",
                    "critical": null
                },
                "HPS": {
                    "real": "2.727",
                    "theoretical": "3"
                }
            }
        },
        {
            "name": "xduskstriker",
            "category": "Shotguns",
            "stats": {
                "DPS": {
                    "real": "458.14",
                    "theoretical": "504",
                    "critical": null,
                    "theoretical_critical": null
                },
                "DPH": {
                    "total": "21 x 8 = 168",
                    "critical": null
                },
                "HPS": {
                    "real": "2.727",
                    "theoretical": "3"
                }
            }
        },
        {
            "name": "dawnstriker",
            "category": "Shotguns",
            "stats": {
                "DPS": {
                    "real": "545.4",
                    "theoretical": "600",
                    "critical": null,
                    "theoretical_critical": null
                },
                "DPH": {
                    "total": "25 x 8 = 200",
                    "critical": null
                },
                "HPS": {
                    "real": "2.727",
                    "theoretical": "3"
                }
            }
        },
        {
            "name": "survivorsmannberg500",
            "category": "Shotguns",
            "stats": {
                "DPS": {
                    "real": "167.19",
                    "theoretical": "175.5",
                    "critical": null,
                    "theoretical_critical": null
                },
                "DPH": {
                    "total": "13 x 9 = 117",
                    "critical": null
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                }
            }
        },
        {
            "name": "cc12",
            "category": "Shotguns",
            "stats": {
                "DPS": {
                    "real": "340.88",
                    "theoretical": "375",
                    "critical": null,
                    "theoretical_critical": null
                },
                "DPH": {
                    "total": "12.5 x 10 = 125",
                    "critical": null
                },
                "HPS": {
                    "real": "2.727",
                    "theoretical": "3"
                }
            }
        },
        {
            "name": "silverslugster",
            "category": "Shotguns",
            "stats": {
                "DPS": {
                    "real": "411.55",
                    "theoretical": "432",
                    "critical": null,
                    "theoretical_critical": null
                },
                "DPH": {
                    "total": "36 x 8 = 288",
                    "critical": null
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                }
            }
        },
        {
            "name": "skorpion",
            "category": "Sub-Machine Guns",
            "stats": {
                "DPS": {
                    "real": "16.67",
                    "theoretical": "21.43",
                    "critical": "43.34",
                    "theoretical_critical": "55.712"
                },
                "DPH": {
                    "total": "2.5",
                    "critical": "12.5"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                }
            }
        },
        {
            "name": "uzi",
            "category": "Sub-Machine Guns",
            "stats": {
                "DPS": {
                    "real": "20",
                    "theoretical": "25.71",
                    "critical": "52",
                    "theoretical_critical": "66.85"
                },
                "DPH": {
                    "total": "3",
                    "critical": "15"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                }
            }
        },
        {
            "name": "fmp90",
            "category": "Sub-Machine Guns",
            "stats": {
                "DPS": {
                    "real": "23.34",
                    "theoretical": "30",
                    "critical": "60.67",
                    "theoretical_critical": "78"
                },
                "DPH": {
                    "total": "3.5",
                    "critical": "17.5"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                }
            }
        },
        {
            "name": "mp5",
            "category": "Sub-Machine Guns",
            "stats": {
                "DPS": {
                    "real": "26.66",
                    "theoretical": "34.28",
                    "critical": "69.34",
                    "theoretical_critical": "89.14"
                },
                "DPH": {
                    "total": "4",
                    "critical": "20"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                }
            }
        },
        {
            "name": "pp19",
            "category": "Sub-Machine Guns",
            "stats": {
                "DPS": {
                    "real": "30",
                    "theoretical": "38.57",
                    "critical": "78",
                    "theoretical_critical": "100.28"
                },
                "DPH": {
                    "total": "4.5",
                    "critical": "22.5"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                }
            }
        },
        {
            "name": "blackoutb19",
            "category": "Sub-Machine Guns",
            "stats": {
                "DPS": {
                    "real": "36.67",
                    "theoretical": "47.14",
                    "critical": "95.34",
                    "theoretical_critical": "122.57"
                },
                "DPH": {
                    "total": "5.5",
                    "critical": "27.5"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                }
            }
        },
        {
            "name": "pp90",
            "category": "Sub-Machine Guns",
            "stats": {
                "DPS": {
                    "real": "33.34",
                    "theoretical": "42.86",
                    "critical": "86.68",
                    "theoretical_critical": "111.43"
                },
                "DPH": {
                    "total": "5",
                    "critical": "25"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                }
            }
        },
        {
            "name": "grammm11",
            "category": "Sub-Machine Guns",
            "stats": {
                "DPS": {
                    "real": "36.67",
                    "theoretical": "47.14",
                    "critical": "95.34",
                    "theoretical_critical": "122.57"
                },
                "DPH": {
                    "total": "5.5",
                    "critical": "27.5"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                }
            }
        },
        {
            "name": "makeshiftsmg",
            "category": "Sub-Machine Guns",
            "stats": {
                "DPS": {
                    "real": "40.01",
                    "theoretical": "51.43",
                    "critical": "104.01",
                    "theoretical_critical": "133.71"
                },
                "DPH": {
                    "total": "6",
                    "critical": "30"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                }
            }
        },
        {
            "name": "mp40",
            "category": "Sub-Machine Guns",
            "stats": {
                "DPS": {
                    "real": "40.01",
                    "theoretical": "51.43",
                    "critical": "104.01",
                    "theoretical_critical": "133.71"
                },
                "DPH": {
                    "total": "6",
                    "critical": "30"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                }
            }
        },
        {
            "name": "ump",
            "category": "Sub-Machine Guns",
            "stats": {
                "DPS": {
                    "real": "43.33",
                    "theoretical": "55.71",
                    "critical": "112.67",
                    "theoretical_critical": "144.85"
                },
                "DPH": {
                    "total": "6.5",
                    "critical": "32.5"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                }
            }
        },
        {
            "name": "cqccommander40",
            "category": "Sub-Machine Guns",
            "stats": {
                "DPS": {
                    "real": "50",
                    "theoretical": "64.28",
                    "critical": "130",
                    "theoretical_critical": "167.13"
                },
                "DPH": {
                    "total": "7.5",
                    "critical": "37.5"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                }
            }
        },
        {
            "name": "talon40",
            "category": "Sub-Machine Guns",
            "stats": {
                "DPS": {
                    "real": "46.67",
                    "theoretical": "60",
                    "critical": "121.35",
                    "theoretical_critical": "156"
                },
                "DPH": {
                    "total": "7",
                    "critical": "35"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                }
            }
        },
        {
            "name": "chicagotypewriter",
            "category": "Sub-Machine Guns",
            "stats": {
                "DPS": {
                    "real": "50",
                    "theoretical": "64.28",
                    "critical": "130",
                    "theoretical_critical": "167.13"
                },
                "DPH": {
                    "total": "7.5",
                    "critical": "37.5"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                }
            }
        },
        {
            "name": "k50m",
            "category": "Sub-Machine Guns",
            "stats": {
                "DPS": {
                    "real": "53.34",
                    "theoretical": "68.57",
                    "critical": "138.68",
                    "theoretical_critical": "178.28"
                },
                "DPH": {
                    "total": "8",
                    "critical": "40"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                }
            }
        },
        {
            "name": "seaserpentm50",
            "category": "Sub-Machine Guns",
            "stats": {
                "DPS": {
                    "real": "40.01",
                    "theoretical": "51.43",
                    "critical": "168.01",
                    "theoretical_critical": "215.99"
                },
                "DPH": {
                    "total": "6",
                    "critical": "30"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                }
            }
        },
        {
            "name": "ppsh41",
            "category": "Sub-Machine Guns",
            "stats": {
                "DPS": {
                    "real": "56.52",
                    "theoretical": "79.59",
                    "critical": "146.96",
                    "theoretical_critical": "206.94"
                },
                "DPH": {
                    "total": "6.5",
                    "critical": "32.5"
                },
                "HPS": {
                    "real": "8.696",
                    "theoretical": "12.245"
                }
            }
        },
        {
            "name": "crissvictor",
            "category": "Sub-Machine Guns",
            "stats": {
                "DPS": {
                    "real": "66.67",
                    "theoretical": "85.71",
                    "critical": "173.35",
                    "theoretical_critical": "222.85"
                },
                "DPH": {
                    "total": "10",
                    "critical": "50"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                }
            }
        },
        {
            "name": "uziel14mm",
            "category": "Sub-Machine Guns",
            "stats": {
                "DPS": {
                    "real": "80",
                    "theoretical": "102.85",
                    "critical": "208.01",
                    "theoretical_critical": "267.42"
                },
                "DPH": {
                    "total": "12",
                    "critical": "60"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                }
            }
        },
        {
            "name": "furyclawpdw",
            "category": "Sub-Machine Guns",
            "stats": {
                "DPS": {
                    "real": "100.01",
                    "theoretical": "128.57",
                    "critical": "260.01",
                    "theoretical_critical": "334.27"
                },
                "DPH": {
                    "total": "15",
                    "critical": "75"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                }
            }
        },
        {
            "name": "streetdog99",
            "category": "Sub-Machine Guns",
            "stats": {
                "DPS": {
                    "real": "100.01",
                    "theoretical": "128.57",
                    "critical": "260.01",
                    "theoretical_critical": "334.27"
                },
                "DPH": {
                    "total": "15",
                    "critical": "75"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                }
            }
        },
        {
            "name": "xmp5",
            "category": "Sub-Machine Guns",
            "stats": {
                "DPS": {
                    "real": "133.34",
                    "theoretical": "171.42",
                    "critical": "346.68",
                    "theoretical_critical": "445.69"
                },
                "DPH": {
                    "total": "20",
                    "critical": "100"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                }
            }
        },
        {
            "name": "xmp555",
            "category": "Sub-Machine Guns",
            "stats": {
                "DPS": {
                    "real": "133.34",
                    "theoretical": "171.42",
                    "critical": "346.68",
                    "theoretical_critical": "445.69"
                },
                "DPH": {
                    "total": "20",
                    "critical": "100"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                }
            }
        },
        {
            "name": "heatpit75",
            "category": "Sub-Machine Guns",
            "stats": {
                "DPS": {
                    "real": "150.01",
                    "theoretical": "192.85",
                    "critical": "390.02",
                    "theoretical_critical": "501.4"
                },
                "DPH": {
                    "total": "11.25 x 2 = 22.5",
                    "critical": "56.25"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                }
            }
        },
        {
            "name": "spectersmg9",
            "category": "Sub-Machine Guns",
            "stats": {
                "DPS": {
                    "real": "166.68",
                    "theoretical": "214.28",
                    "critical": "433.36",
                    "theoretical_critical": "557.12"
                },
                "DPH": {
                    "total": "25",
                    "critical": "125"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                }
            }
        },
        {
            "name": "marauder55",
            "category": "Sub-Machine Guns",
            "stats": {
                "DPS": {
                    "real": "122.03",
                    "theoretical": "184.62",
                    "critical": "512.51",
                    "theoretical_critical": "775.4"
                },
                "DPH": {
                    "total": "12",
                    "critical": "60"
                },
                "HPS": {
                    "real": "10.169",
                    "theoretical": "15.385"
                }
            }
        },
        {
            "name": "corpseripper",
            "category": "Sub-Machine Guns",
            "stats": {
                "DPS": {
                    "real": "73.34",
                    "theoretical": "94.28",
                    "critical": "190.68",
                    "theoretical_critical": "245.13"
                },
                "DPH": {
                    "total": "11",
                    "critical": "55"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                }
            }
        },
        {
            "name": "handshocka8",
            "category": "Sub-Machine Guns",
            "stats": {
                "DPS": {
                    "real": "86.67",
                    "theoretical": "111.42",
                    "critical": "225.34",
                    "theoretical_critical": "289.7"
                },
                "DPH": {
                    "total": "13",
                    "critical": "65"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                }
            }
        },
        {
            "name": "ninecutterx",
            "category": "Sub-Machine Guns",
            "stats": {
                "DPS": {
                    "real": "126.67",
                    "theoretical": "162.85",
                    "critical": "329.35",
                    "theoretical_critical": "423.41"
                },
                "DPH": {
                    "total": "19",
                    "critical": "95"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                }
            }
        },
        {
            "name": "raptorx9",
            "category": "Sub-Machine Guns",
            "stats": {
                "DPS": {
                    "real": "156.53",
                    "theoretical": "220.41",
                    "critical": "406.98",
                    "theoretical_critical": "573.07"
                },
                "DPH": {
                    "total": "6 x 3 = 18",
                    "critical": "30"
                },
                "HPS": {
                    "real": "8.696",
                    "theoretical": "12.245"
                }
            }
        },
        {
            "name": "dusksmg",
            "category": "Sub-Machine Guns",
            "stats": {
                "DPS": {
                    "real": "106.68",
                    "theoretical": "137.14",
                    "critical": "277.34",
                    "theoretical_critical": "356.55"
                },
                "DPH": {
                    "total": "8 x 2 = 16",
                    "critical": "40"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                }
            }
        },
        {
            "name": "xdusksmg",
            "category": "Sub-Machine Guns",
            "stats": {
                "DPS": {
                    "real": "140.01",
                    "theoretical": "179.99",
                    "critical": "364.02",
                    "theoretical_critical": "467.98"
                },
                "DPH": {
                    "total": "10.5 x 2 = 21",
                    "critical": "52.5"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                }
            }
        },
        {
            "name": "dawnsmg",
            "category": "Sub-Machine Guns",
            "stats": {
                "DPS": {
                    "real": "173.35",
                    "theoretical": "222.85",
                    "critical": "450.69",
                    "theoretical_critical": "579.4"
                },
                "DPH": {
                    "total": "13 x 2 = 26",
                    "critical": "65"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                }
            }
        },
        {
            "name": "survivorsstelltmp",
            "category": "Sub-Machine Guns",
            "stats": {
                "DPS": {
                    "real": "53.34",
                    "theoretical": "68.57",
                    "critical": "138.68",
                    "theoretical_critical": "178.28"
                },
                "DPH": {
                    "total": "8",
                    "critical": "40"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                }
            }
        },
        {
            "name": "santaslittlehelper",
            "category": "Sub-Machine Guns",
            "stats": {
                "DPS": {
                    "real": "134.79",
                    "theoretical": "189.8",
                    "critical": "350.45",
                    "theoretical_critical": "493.47"
                },
                "DPH": {
                    "total": "15.5",
                    "critical": "77.5"
                },
                "HPS": {
                    "real": "8.696",
                    "theoretical": "12.245"
                }
            }
        },
        {
            "name": "m16",
            "category": "Assault Rifles",
            "stats": {
                "DPS": {
                    "real": "33.34",
                    "theoretical": "42.86",
                    "critical": "38.67",
                    "theoretical_critical": "49.71"
                },
                "DPH": {
                    "total": "3 + 1 + 1 = 5",
                    "critical": "15 + 5 + 5 = 25"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                }
            }
        },
        {
            "name": "fmfnc",
            "category": "Assault Rifles",
            "stats": {
                "DPS": {
                    "real": "40.01",
                    "theoretical": "51.43",
                    "critical": "46.4",
                    "theoretical_critical": "59.65"
                },
                "DPH": {
                    "total": "3.6 + 1.2 + 1.2 = 6",
                    "critical": "18 + 6 + 6 = 30"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                }
            }
        },
        {
            "name": "sa80",
            "category": "Assault Rifles",
            "stats": {
                "DPS": {
                    "real": "46.67",
                    "theoretical": "60",
                    "critical": "54.14",
                    "theoretical_critical": "69.6"
                },
                "DPH": {
                    "total": "4.2 + 1.4 + 1.4 = 7",
                    "critical": "21 + 7 + 7 = 35"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                }
            }
        },
        {
            "name": "mesaacr",
            "category": "Assault Rifles",
            "stats": {
                "DPS": {
                    "real": "53.34",
                    "theoretical": "68.57",
                    "critical": "61.87",
                    "theoretical_critical": "79.54"
                },
                "DPH": {
                    "total": "4.8 + 1.6 + 1.6 = 8",
                    "critical": "24 + 8 + 8 = 40"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                }
            }
        },
        {
            "name": "makeshiftar",
            "category": "Assault Rifles",
            "stats": {
                "DPS": {
                    "real": "66.67",
                    "theoretical": "85.71",
                    "critical": "77.33",
                    "theoretical_critical": "99.42"
                },
                "DPH": {
                    "total": "6 + 2 + 2 = 10",
                    "critical": "30 + 10 + 10 = 50"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                }
            }
        },
        {
            "name": "stellaug",
            "category": "Assault Rifles",
            "stats": {
                "DPS": {
                    "real": "66.67",
                    "theoretical": "85.71",
                    "critical": "77.33",
                    "theoretical_critical": "99.42"
                },
                "DPH": {
                    "total": "6 + 2 + 2 = 10",
                    "critical": "30 + 10 + 10 = 50"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                }
            }
        },
        {
            "name": "xm8",
            "category": "Assault Rifles",
            "stats": {
                "DPS": {
                    "real": "80.01",
                    "theoretical": "102.86",
                    "critical": "92.81",
                    "theoretical_critical": "119.31"
                },
                "DPH": {
                    "total": "7.2 + 2.4 + 2.4 = 12",
                    "critical": "36 + 12 + 12 = 60"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                }
            }
        },
        {
            "name": "g3",
            "category": "Assault Rifles",
            "stats": {
                "DPS": {
                    "real": "27.27",
                    "theoretical": "30",
                    "critical": "114.53",
                    "theoretical_critical": "126"
                },
                "DPH": {
                    "total": "6 + 2 + 2 = 10",
                    "critical": "30 + 10 + 10 = 50"
                },
                "HPS": {
                    "real": "2.727",
                    "theoretical": "3"
                }
            }
        },
        {
            "name": "fmfal",
            "category": "Assault Rifles",
            "stats": {
                "DPS": {
                    "real": "93.34",
                    "theoretical": "120",
                    "critical": "108.28",
                    "theoretical_critical": "139.2"
                },
                "DPH": {
                    "total": "8.4 + 2.8 + 2.8 = 14",
                    "critical": "42 + 14 + 14 = 70"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                }
            }
        },
        {
            "name": "ak47",
            "category": "Assault Rifles",
            "stats": {
                "DPS": {
                    "real": "113.34",
                    "theoretical": "145.71",
                    "critical": "131.47",
                    "theoretical_critical": "169.02"
                },
                "DPH": {
                    "total": "10.2 + 3.4 + 3.4 = 17",
                    "critical": "51 + 17 + 17 = 85"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                }
            }
        },
        {
            "name": "m4",
            "category": "Assault Rifles",
            "stats": {
                "DPS": {
                    "real": "126.68",
                    "theoretical": "162.86",
                    "critical": "146.94",
                    "theoretical_critical": "188.91"
                },
                "DPH": {
                    "total": "11.4 + 3.8 + 3.8 = 19",
                    "critical": "57 + 19 + 19 = 95"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                }
            }
        },
        {
            "name": "asval",
            "category": "Assault Rifles",
            "stats": {
                "DPS": {
                    "real": "139.82",
                    "theoretical": "211.54",
                    "critical": "162.19",
                    "theoretical_critical": "245.38"
                },
                "DPH": {
                    "total": "8.25 + 2.75 + 2.75 = 13.75",
                    "critical": "41.25 + 13.75 + 13.75 = 68.75"
                },
                "HPS": {
                    "real": "10.169",
                    "theoretical": "15.385"
                }
            }
        },
        {
            "name": "asvalghost",
            "category": "Assault Rifles",
            "stats": {
                "DPS": {
                    "real": "284.73",
                    "theoretical": "430.77",
                    "critical": "330.28",
                    "theoretical_critical": "499.69"
                },
                "DPH": {
                    "total": "16.8 + 5.6 + 5.6 = 28",
                    "critical": "84 + 28 + 28 = 140"
                },
                "HPS": {
                    "real": "10.169",
                    "theoretical": "15.385"
                }
            }
        },
        {
            "name": "biowolf127",
            "category": "Assault Rifles",
            "stats": {
                "DPS": {
                    "real": "186.69",
                    "theoretical": "240",
                    "critical": "216.55",
                    "theoretical_critical": "278.39"
                },
                "DPH": {
                    "total": "16.8 + 5.6 + 5.6 = 28",
                    "critical": "84 + 28 + 28 = 140"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                }
            }
        },
        {
            "name": "ebr12",
            "category": "Assault Rifles",
            "stats": {
                "DPS": {
                    "real": "59.99",
                    "theoretical": "66",
                    "critical": "251.97",
                    "theoretical_critical": "277.2"
                },
                "DPH": {
                    "total": "13.2 + 4.4 + 4.4 = 22",
                    "critical": "66 + 22 + 22 = 110"
                },
                "HPS": {
                    "real": "2.727",
                    "theoretical": "3"
                }
            }
        },
        {
            "name": "sentinels19",
            "category": "Assault Rifles",
            "stats": {
                "DPS": {
                    "real": "233.34",
                    "theoretical": "299.98",
                    "critical": "270.68",
                    "theoretical_critical": "347.98"
                },
                "DPH": {
                    "total": "21 + 7 + 7 = 35",
                    "critical": "105 + 35 + 35 = 175"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                }
            }
        },
        {
            "name": "sandstorms19",
            "category": "Assault Rifles",
            "stats": {
                "DPS": {
                    "real": "300.03",
                    "theoretical": "385.71",
                    "critical": "348.02",
                    "theoretical_critical": "447.41"
                },
                "DPH": {
                    "total": "36 + 9  = 45",
                    "critical": "180 + 45 = 225"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                }
            }
        },
        {
            "name": "hammerhead47",
            "category": "Assault Rifles",
            "stats": {
                "DPS": {
                    "real": "266.68",
                    "theoretical": "342.84",
                    "critical": "309.35",
                    "theoretical_critical": "397.69"
                },
                "DPH": {
                    "total": "24 + 8 + 8 = 40",
                    "critical": "120 + 40 + 40 = 200"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                }
            }
        },
        {
            "name": "xak47",
            "category": "Assault Rifles",
            "stats": {
                "DPS": {
                    "real": "320.02",
                    "theoretical": "411.41",
                    "critical": "371.22",
                    "theoretical_critical": "477.23"
                },
                "DPH": {
                    "total": "[14.4 + 4.8 + 4.8] x 2 = 48",
                    "critical": "72 + 24 + 24 = 120"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                }
            }
        },
        {
            "name": "a10bullshark",
            "category": "Assault Rifles",
            "stats": {
                "DPS": {
                    "real": "360.01",
                    "theoretical": "462.83",
                    "critical": "417.62",
                    "theoretical_critical": "536.89"
                },
                "DPH": {
                    "total": "32.4 + 10.8 + 10.8 = 54",
                    "critical": "162 + 54 + 54 = 270"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                }
            }
        },
        {
            "name": "lr32",
            "category": "Assault Rifles",
            "stats": {
                "DPS": {
                    "real": "243.49",
                    "theoretical": "342.86",
                    "critical": "438.28",
                    "theoretical_critical": "617.15"
                },
                "DPH": {
                    "total": "16.8 + 5.6 + 5.6 = 28",
                    "critical": "84 + 28 + 28 = 140"
                },
                "HPS": {
                    "real": "8.696",
                    "theoretical": "12.245"
                }
            }
        },
        {
            "name": "warhawkx10",
            "category": "Assault Rifles",
            "stats": {
                "DPS": {
                    "real": "500.05",
                    "theoretical": "642.86",
                    "critical": "580.06",
                    "theoretical_critical": "745.72"
                },
                "DPH": {
                    "total": "45 + 15 + 15 = 75",
                    "critical": "225 + 75 + 75 = 375"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                }
            }
        },
        {
            "name": "amethystraider",
            "category": "Assault Rifles",
            "stats": {
                "DPS": {
                    "real": "382.24",
                    "theoretical": "412.8",
                    "critical": "443.4",
                    "theoretical_critical": "478.85"
                },
                "DPH": {
                    "total": "56.76 + 56.76 + 58.48 = 172",
                    "critical": "283.8 + 283.8 + 292.4 = 860"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "7.2"
                }
            }
        },
        {
            "name": "hypercoilx1",
            "category": "Assault Rifles",
            "stats": {
                "DPS": {
                    "real": "151.04",
                    "theoretical": "171.2",
                    "critical": "634.37",
                    "theoretical_critical": "719.04"
                },
                "DPH": {
                    "total": "17.12 + 8.56 + 8.56 + 8.56 = 42.8",
                    "critical": "85.6 + 42.8 + 42.8 + 42.8 = 214"
                },
                "HPS": {
                    "real": "3.529",
                    "theoretical": "4"
                }
            }
        },
        {
            "name": "amberraider",
            "category": "Assault Rifles",
            "stats": {
                "DPS": {
                    "real": "322.24",
                    "theoretical": "348",
                    "critical": "373.8",
                    "theoretical_critical": "403.68"
                },
                "DPH": {
                    "total": "47.85 + 47.85 + 49.3 = 145",
                    "critical": "239.25 + 239.25 + 246.5 = 725"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "7.2"
                }
            }
        },
        {
            "name": "haretrigger47",
            "category": "Assault Rifles",
            "stats": {
                "DPS": {
                    "real": "365.23",
                    "theoretical": "514.29",
                    "critical": null,
                    "theoretical_critical": null
                },
                "DPH": {
                    "total": "25.2 + 8.4 + 8.4 = 42",
                    "critical": null
                },
                "HPS": {
                    "real": "8.696",
                    "theoretical": "12.245"
                }
            }
        },
        {
            "name": "bar",
            "category": "Heavy Machine Guns",
            "stats": {
                "DPS": {
                    "real": "137.14",
                    "theoretical": "192",
                    "critical": "159.08",
                    "theoretical_critical": "222.72"
                },
                "DPH": {
                    "total": "16",
                    "critical": "80"
                },
                "HPS": {
                    "real": "8.571",
                    "theoretical": "12"
                }
            }
        },
        {
            "name": "fmmitrail",
            "category": "Heavy Machine Guns",
            "stats": {
                "DPS": {
                    "real": "154.28",
                    "theoretical": "216",
                    "critical": "178.96",
                    "theoretical_critical": "250.56"
                },
                "DPH": {
                    "total": "18",
                    "critical": "90"
                },
                "HPS": {
                    "real": "8.571",
                    "theoretical": "12"
                }
            }
        },
        {
            "name": "fmmag",
            "category": "Heavy Machine Guns",
            "stats": {
                "DPS": {
                    "real": "171.42",
                    "theoretical": "240",
                    "critical": "198.85",
                    "theoretical_critical": "278.4"
                },
                "DPH": {
                    "total": "20",
                    "critical": "100"
                },
                "HPS": {
                    "real": "8.571",
                    "theoretical": "12"
                }
            }
        },
        {
            "name": "m60",
            "category": "Heavy Machine Guns",
            "stats": {
                "DPS": {
                    "real": "205.7",
                    "theoretical": "288",
                    "critical": "238.62",
                    "theoretical_critical": "334.08"
                },
                "DPH": {
                    "total": "24",
                    "critical": "120"
                },
                "HPS": {
                    "real": "8.571",
                    "theoretical": "12"
                }
            }
        },
        {
            "name": "mg42",
            "category": "Heavy Machine Guns",
            "stats": {
                "DPS": {
                    "real": "239.99",
                    "theoretical": "336",
                    "critical": "278.39",
                    "theoretical_critical": "389.76"
                },
                "DPH": {
                    "total": "28",
                    "critical": "140"
                },
                "HPS": {
                    "real": "8.571",
                    "theoretical": "12"
                }
            }
        },
        {
            "name": "corpsedestroyer",
            "category": "Heavy Machine Guns",
            "stats": {
                "DPS": {
                    "real": "243.49",
                    "theoretical": "342.86",
                    "critical": "262.97",
                    "theoretical_critical": "370.29"
                },
                "DPH": {
                    "total": "28",
                    "critical": "140"
                },
                "HPS": {
                    "real": "8.696",
                    "theoretical": "12.245"
                }
            }
        },
        {
            "name": "avalanchemg14",
            "category": "Heavy Machine Guns",
            "stats": {
                "DPS": {
                    "real": "439.15",
                    "theoretical": "618.37",
                    "critical": "474.28",
                    "theoretical_critical": "667.84"
                },
                "DPH": {
                    "total": "50.5",
                    "critical": "252.5"
                },
                "HPS": {
                    "real": "8.696",
                    "theoretical": "12.245"
                }
            }
        },
        {
            "name": "duskmag",
            "category": "Heavy Machine Guns",
            "stats": {
                "DPS": {
                    "real": "308.56",
                    "theoretical": "432",
                    "critical": "333.24",
                    "theoretical_critical": "466.56"
                },
                "DPH": {
                    "total": "18 x 2 = 36",
                    "critical": "90"
                },
                "HPS": {
                    "real": "8.571",
                    "theoretical": "12"
                }
            }
        },
        {
            "name": "xduskmag",
            "category": "Heavy Machine Guns",
            "stats": {
                "DPS": {
                    "real": "411.41",
                    "theoretical": "576",
                    "critical": "444.32",
                    "theoretical_critical": "622.08"
                },
                "DPH": {
                    "total": "24 x 2 = 48",
                    "critical": "120"
                },
                "HPS": {
                    "real": "8.571",
                    "theoretical": "12"
                }
            }
        },
        {
            "name": "dawnmag",
            "category": "Heavy Machine Guns",
            "stats": {
                "DPS": {
                    "real": "479.98",
                    "theoretical": "672",
                    "critical": "518.37",
                    "theoretical_critical": "725.76"
                },
                "DPH": {
                    "total": "28 x 2 = 56",
                    "critical": "140"
                },
                "HPS": {
                    "real": "8.571",
                    "theoretical": "12"
                }
            }
        },
        {
            "name": "hareraiser",
            "category": "Heavy Machine Guns",
            "stats": {
                "DPS": {
                    "real": "347.84",
                    "theoretical": "489.8",
                    "critical": "375.66",
                    "theoretical_critical": "528.98"
                },
                "DPH": {
                    "total": "40",
                    "critical": "200"
                },
                "HPS": {
                    "real": "8.696",
                    "theoretical": "12.245"
                }
            }
        },
        {
            "name": "vulcan",
            "category": "Heavy Machine Guns",
            "stats": {
                "DPS": {
                    "real": "226.1",
                    "theoretical": "318.37",
                    "critical": "244.18",
                    "theoretical_critical": "343.84"
                },
                "DPH": {
                    "total": "13 x 2 = 26",
                    "critical": "65"
                },
                "HPS": {
                    "real": "8.696",
                    "theoretical": "12.245"
                }
            }
        },
        {
            "name": "xmg5200",
            "category": "Heavy Machine Guns",
            "stats": {
                "DPS": {
                    "real": "269.58",
                    "theoretical": "379.6",
                    "critical": "291.14",
                    "theoretical_critical": "409.96"
                },
                "DPH": {
                    "total": "15.5 x 2 = 31",
                    "critical": "77.5"
                },
                "HPS": {
                    "real": "8.696",
                    "theoretical": "12.245"
                }
            }
        },
        {
            "name": "scar9000",
            "category": "Heavy Machine Guns",
            "stats": {
                "DPS": {
                    "real": "313.06",
                    "theoretical": "440.82",
                    "critical": "338.1",
                    "theoretical_critical": "476.09"
                },
                "DPH": {
                    "total": "18 x 2 = 36",
                    "critical": "90"
                },
                "HPS": {
                    "real": "8.696",
                    "theoretical": "12.245"
                }
            }
        },
        {
            "name": "tempest",
            "category": "Heavy Machine Guns",
            "stats": {
                "DPS": {
                    "real": "347.84",
                    "theoretical": "489.8",
                    "critical": "375.67",
                    "theoretical_critical": "528.984"
                },
                "DPH": {
                    "total": "10 x 4 = 40",
                    "critical": "50"
                },
                "HPS": {
                    "real": "8.696",
                    "theoretical": "12.245"
                }
            }
        },
        {
            "name": "pocketcannon",
            "category": "Heavy Machine Guns",
            "stats": {
                "DPS": {
                    "real": "247.5",
                    "theoretical": "495",
                    "critical": null,
                    "theoretical_critical": null
                },
                "DPH": {
                    "total": "5.5 x 3 = 16.5",
                    "critical": null
                },
                "HPS": {
                    "real": "15",
                    "theoretical": "30"
                }
            }
        },
        {
            "name": "xlgunner8",
            "category": "Heavy Machine Guns",
            "stats": {
                "DPS": {
                    "real": "278.27",
                    "theoretical": "391.84",
                    "critical": "322.79",
                    "theoretical_critical": "454.53"
                },
                "DPH": {
                    "total": "16 x 2 = 32",
                    "critical": "80"
                },
                "HPS": {
                    "real": "8.696",
                    "theoretical": "12.245"
                }
            }
        },
        {
            "name": "gau19",
            "category": "Heavy Machine Guns",
            "stats": {
                "DPS": {
                    "real": "365.23",
                    "theoretical": "514.29",
                    "critical": "394.45",
                    "theoretical_critical": "555.433"
                },
                "DPH": {
                    "total": "14 x 3 = 42",
                    "critical": "70"
                },
                "HPS": {
                    "real": "8.696",
                    "theoretical": "12.245"
                }
            }
        },
        {
            "name": "gau19unlimitedammo",
            "category": "Heavy Machine Guns",
            "stats": {
                "DPS": {
                    "real": "365.23",
                    "theoretical": "514.29",
                    "critical": "394.45",
                    "theoretical_critical": "555.433"
                },
                "DPH": {
                    "total": "14 x 3 = 42",
                    "critical": "70"
                },
                "HPS": {
                    "real": "8.696",
                    "theoretical": "12.245"
                }
            }
        },
        {
            "name": "krakenslayer",
            "category": "Heavy Machine Guns",
            "stats": {
                "DPS": {
                    "real": "521.75",
                    "theoretical": "734.69",
                    "critical": null,
                    "theoretical_critical": null
                },
                "DPH": {
                    "total": "12 x 5 = 60",
                    "critical": null
                },
                "HPS": {
                    "real": "8.696",
                    "theoretical": "12.245"
                }
            }
        },
        {
            "name": "wraithcannon",
            "category": "Heavy Machine Guns",
            "stats": {
                "DPS": {
                    "real": "547.85",
                    "theoretical": "771.44",
                    "critical": "591.68",
                    "theoretical_critical": "833.15"
                },
                "DPH": {
                    "total": "21 x 3 = 63",
                    "critical": "105"
                },
                "HPS": {
                    "real": "8.696",
                    "theoretical": "12.245"
                }
            }
        },
        {
            "name": "uwraithcannon",
            "category": "Heavy Machine Guns",
            "stats": {
                "DPS": {
                    "real": "547.85",
                    "theoretical": "771.44",
                    "critical": "591.68",
                    "theoretical_critical": "833.15"
                },
                "DPH": {
                    "total": "21 x 3 = 63",
                    "critical": "105"
                },
                "HPS": {
                    "real": "8.696",
                    "theoretical": "12.245"
                }
            }
        },
        {
            "name": "m79",
            "category": "Grenade Launchers",
            "stats": {
                "DPS": {
                    "real": "24.2",
                    "theoretical": "25",
                    "critical": "121",
                    "theoretical_critical": "125"
                },
                "DPH": {
                    "total": "25",
                    "critical": "125"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                }
            }
        },
        {
            "name": "hk69",
            "category": "Grenade Launchers",
            "stats": {
                "DPS": {
                    "real": "27.1",
                    "theoretical": "28",
                    "critical": "135.52",
                    "theoretical_critical": "140"
                },
                "DPH": {
                    "total": "28",
                    "critical": "140"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                }
            }
        },
        {
            "name": "rgm40",
            "category": "Grenade Launchers",
            "stats": {
                "DPS": {
                    "real": "30.01",
                    "theoretical": "31",
                    "critical": "150.04",
                    "theoretical_critical": "155"
                },
                "DPH": {
                    "total": "31",
                    "critical": "155"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                }
            }
        },
        {
            "name": "gm94",
            "category": "Grenade Launchers",
            "stats": {
                "DPS": {
                    "real": "32.91",
                    "theoretical": "34",
                    "critical": "164.56",
                    "theoretical_critical": "170"
                },
                "DPH": {
                    "total": "34",
                    "critical": "170"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                }
            }
        },
        {
            "name": "makeshiftlauncher",
            "category": "Grenade Launchers",
            "stats": {
                "DPS": {
                    "real": "38.72",
                    "theoretical": "40",
                    "critical": "193.6",
                    "theoretical_critical": "200"
                },
                "DPH": {
                    "total": "40",
                    "critical": "200"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                }
            }
        },
        {
            "name": "chinalake",
            "category": "Grenade Launchers",
            "stats": {
                "DPS": {
                    "real": "35.82",
                    "theoretical": "37",
                    "critical": "179.08",
                    "theoretical_critical": "185"
                },
                "DPH": {
                    "total": "37",
                    "critical": "185"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                }
            }
        },
        {
            "name": "rg6",
            "category": "Grenade Launchers",
            "stats": {
                "DPS": {
                    "real": "38.72",
                    "theoretical": "40",
                    "critical": "193.6",
                    "theoretical_critical": "200"
                },
                "DPH": {
                    "total": "40",
                    "critical": "200"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                }
            }
        },
        {
            "name": "falconmm1",
            "category": "Grenade Launchers",
            "stats": {
                "DPS": {
                    "real": "41.62",
                    "theoretical": "43",
                    "critical": "208.12",
                    "theoretical_critical": "215"
                },
                "DPH": {
                    "total": "43",
                    "critical": "215"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                }
            }
        },
        {
            "name": "type87",
            "category": "Grenade Launchers",
            "stats": {
                "DPS": {
                    "real": "44.3",
                    "theoretical": "46.5",
                    "critical": "221.5",
                    "theoretical_critical": "232.5"
                },
                "DPH": {
                    "total": "31",
                    "critical": "155"
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                }
            }
        },
        {
            "name": "mgl6",
            "category": "Grenade Launchers",
            "stats": {
                "DPS": {
                    "real": "50.02",
                    "theoretical": "52.5",
                    "critical": "250.08",
                    "theoretical_critical": "262.5"
                },
                "DPH": {
                    "total": "35",
                    "critical": "175"
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                }
            }
        },
        {
            "name": "xm25",
            "category": "Grenade Launchers",
            "stats": {
                "DPS": {
                    "real": "57.16",
                    "theoretical": "60",
                    "critical": "285.8",
                    "theoretical_critical": "300"
                },
                "DPH": {
                    "total": "40",
                    "critical": "200"
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                }
            }
        },
        {
            "name": "paw20",
            "category": "Grenade Launchers",
            "stats": {
                "DPS": {
                    "real": "65.63",
                    "theoretical": "70",
                    "critical": "328.13",
                    "theoretical_critical": "350"
                },
                "DPH": {
                    "total": "35",
                    "critical": "175"
                },
                "HPS": {
                    "real": "1.875",
                    "theoretical": "2"
                }
            }
        },
        {
            "name": "immolatorad",
            "category": "Grenade Launchers",
            "stats": {
                "DPS": {
                    "real": "72.6",
                    "theoretical": "75",
                    "critical": "363",
                    "theoretical_critical": "375"
                },
                "DPH": {
                    "total": "75",
                    "critical": "375"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                }
            }
        },
        {
            "name": "dreadnoughtad",
            "category": "Grenade Launchers",
            "stats": {
                "DPS": {
                    "real": "82.28",
                    "theoretical": "85",
                    "critical": "411.4",
                    "theoretical_critical": "425"
                },
                "DPH": {
                    "total": "85",
                    "critical": "425"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                }
            }
        },
        {
            "name": "junker6",
            "category": "Grenade Launchers",
            "stats": {
                "DPS": {
                    "real": "85.74",
                    "theoretical": "90",
                    "critical": "428.7",
                    "theoretical_critical": "450"
                },
                "DPH": {
                    "total": "60",
                    "critical": "300"
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                }
            }
        },
        {
            "name": "xm79",
            "category": "Grenade Launchers",
            "stats": {
                "DPS": {
                    "real": "101.64",
                    "theoretical": "105",
                    "critical": "508.2",
                    "theoretical_critical": "525"
                },
                "DPH": {
                    "total": "105",
                    "critical": "525"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                }
            }
        },
        {
            "name": "xm79hg",
            "category": "Grenade Launchers",
            "stats": {
                "DPS": {
                    "real": "101.64",
                    "theoretical": "105",
                    "critical": "508.2",
                    "theoretical_critical": "525"
                },
                "DPH": {
                    "total": "105",
                    "critical": "525"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                }
            }
        },
        {
            "name": "scorchernk19",
            "category": "Grenade Launchers",
            "stats": {
                "DPS": {
                    "real": "109.08",
                    "theoretical": "120",
                    "critical": "545.4",
                    "theoretical_critical": "600"
                },
                "DPH": {
                    "total": "40",
                    "critical": "200"
                },
                "HPS": {
                    "real": "2.727",
                    "theoretical": "3"
                }
            }
        },
        {
            "name": "valkyriemgl",
            "category": "Grenade Launchers",
            "stats": {
                "DPS": {
                    "real": "150.05",
                    "theoretical": "157.5",
                    "critical": "750.23",
                    "theoretical_critical": "787.5"
                },
                "DPH": {
                    "total": "35 x 3 = 105",
                    "critical": "175"
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                }
            }
        },
        {
            "name": "corpseerruptor",
            "category": "Grenade Launchers",
            "stats": {
                "DPS": {
                    "real": "75",
                    "theoretical": "80",
                    "critical": "375",
                    "theoretical_critical": "400"
                },
                "DPH": {
                    "total": "40",
                    "critical": "200"
                },
                "HPS": {
                    "real": "1.875",
                    "theoretical": "2"
                }
            }
        },
        {
            "name": "bishopce9",
            "category": "Grenade Launchers",
            "stats": {
                "DPS": {
                    "real": "85.74",
                    "theoretical": "90",
                    "critical": "428.7",
                    "theoretical_critical": "450"
                },
                "DPH": {
                    "total": "60",
                    "critical": "300"
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                }
            }
        },
        {
            "name": "boomerpx",
            "category": "Grenade Launchers",
            "stats": {
                "DPS": {
                    "real": "101.64",
                    "theoretical": "105",
                    "critical": "508.2",
                    "theoretical_critical": "525"
                },
                "DPH": {
                    "total": "105",
                    "critical": "525"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                }
            }
        },
        {
            "name": "cryolauncher",
            "category": "Grenade Launchers",
            "stats": {
                "DPS": {
                    "real": "101.64",
                    "theoretical": "105",
                    "critical": "508.2",
                    "theoretical_critical": "525"
                },
                "DPH": {
                    "total": "105",
                    "critical": "525"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                }
            }
        },
        {
            "name": "shortfusecrossbow",
            "category": "Grenade Launchers",
            "stats": {
                "DPS": {
                    "real": "145.2",
                    "theoretical": "150",
                    "critical": "726",
                    "theoretical_critical": "750"
                },
                "DPH": {
                    "total": "150",
                    "critical": "750"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                }
            }
        },
        {
            "name": "dusklauncher",
            "category": "Grenade Launchers",
            "stats": {
                "DPS": {
                    "real": "92.89",
                    "theoretical": "97.5",
                    "critical": "464.43",
                    "theoretical_critical": "487.5"
                },
                "DPH": {
                    "total": "65",
                    "critical": "325"
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                }
            }
        },
        {
            "name": "xdusklauncher",
            "category": "Grenade Launchers",
            "stats": {
                "DPS": {
                    "real": "107.18",
                    "theoretical": "112.5",
                    "critical": "535.88",
                    "theoretical_critical": "562.5"
                },
                "DPH": {
                    "total": "75",
                    "critical": "375"
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                }
            }
        },
        {
            "name": "dawnlauncher",
            "category": "Grenade Launchers",
            "stats": {
                "DPS": {
                    "real": "128.61",
                    "theoretical": "135",
                    "critical": "643.05",
                    "theoretical_critical": "675"
                },
                "DPH": {
                    "total": "90",
                    "critical": "450"
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                }
            }
        },
        {
            "name": "survivorsgm94",
            "category": "Grenade Launchers",
            "stats": {
                "DPS": {
                    "real": "40.66",
                    "theoretical": "42",
                    "critical": "203.28",
                    "theoretical_critical": "210"
                },
                "DPH": {
                    "total": "42",
                    "critical": "210"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                }
            }
        },
        {
            "name": "eggsplodermm1",
            "category": "Grenade Launchers",
            "stats": {
                "DPS": {
                    "real": "75",
                    "theoretical": "90",
                    "critical": "375",
                    "theoretical_critical": "450"
                },
                "DPH": {
                    "total": "15",
                    "critical": "75"
                },
                "HPS": {
                    "real": "5",
                    "theoretical": "6"
                }
            }
        },
        {
            "name": "xeggsplodermm1",
            "category": "Grenade Launchers",
            "stats": {
                "DPS": {
                    "real": "86.68",
                    "theoretical": "111.43",
                    "critical": "433.37",
                    "theoretical_critical": "557.14"
                },
                "DPH": {
                    "total": "13",
                    "critical": "65"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                }
            }
        },
        {
            "name": "makeshiftflamethrower",
            "category": "Flamethrowers",
            "stats": {
                "DPS": {
                    "real": "50",
                    "theoretical": "75",
                    "critical": "200",
                    "theoretical_critical": "300"
                },
                "DPH": {
                    "total": "5",
                    "critical": "20"
                },
                "HPS": {
                    "real": "10",
                    "theoretical": "15"
                }
            }
        },
        {
            "name": "incineratorft9",
            "category": "Flamethrowers",
            "stats": {
                "DPS": {
                    "real": "90",
                    "theoretical": "135",
                    "critical": "360",
                    "theoretical_critical": "540"
                },
                "DPH": {
                    "total": "9",
                    "critical": "36"
                },
                "HPS": {
                    "real": "10",
                    "theoretical": "15"
                }
            }
        },
        {
            "name": "dragonsmaw",
            "category": "Flamethrowers",
            "stats": {
                "DPS": {
                    "real": "120",
                    "theoretical": "200",
                    "critical": "600",
                    "theoretical_critical": "1000"
                },
                "DPH": {
                    "total": "10",
                    "critical": "50"
                },
                "HPS": {
                    "real": "12",
                    "theoretical": "20"
                }
            }
        },
        {
            "name": "fatmanscryothrower",
            "category": "Flamethrowers",
            "stats": {
                "DPS": {
                    "real": "87",
                    "theoretical": "174",
                    "critical": "435",
                    "theoretical_critical": "870"
                },
                "DPH": {
                    "total": "5.8",
                    "critical": "29"
                },
                "HPS": {
                    "real": "15",
                    "theoretical": "30"
                }
            }
        },
        {
            "name": "tn8flamethrower",
            "category": "Flamethrowers",
            "stats": {
                "DPS": {
                    "real": "90",
                    "theoretical": "180",
                    "critical": "450",
                    "theoretical_critical": "900"
                },
                "DPH": {
                    "total": "6",
                    "critical": "30"
                },
                "HPS": {
                    "real": "15",
                    "theoretical": "30"
                }
            }
        },
        {
            "name": "sandscorcher",
            "category": "Flamethrowers",
            "stats": {
                "DPS": {
                    "real": "170",
                    "theoretical": "255",
                    "critical": "680",
                    "theoretical_critical": "1020"
                },
                "DPH": {
                    "total": "17",
                    "critical": "68"
                },
                "HPS": {
                    "real": "10",
                    "theoretical": "15"
                }
            }
        },
        {
            "name": "fryingpan",
            "category": "HCIM Weapons",
            "stats": {
                "DPS": {
                    "real": "3.87",
                    "theoretical": "4",
                    "critical": "16.26",
                    "theoretical_critical": "16.8"
                },
                "DPH": {
                    "total": "4",
                    "critical": "20"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                },
                "Melee Range": {
                    "range": "1.25",
                    "cleave_width": "0"
                }
            }
        },
        {
            "name": "goldenfryingpan",
            "category": "HCIM Weapons",
            "stats": {
                "DPS": {
                    "real": "142.9",
                    "theoretical": "150",
                    "critical": "600.18",
                    "theoretical_critical": "630"
                },
                "DPH": {
                    "total": "100",
                    "critical": "500"
                },
                "HPS": {
                    "real": "1.429",
                    "theoretical": "1.5"
                },
                "Melee Range": {
                    "range": "1.9",
                    "cleave_width": "0"
                }
            }
        },
        {
            "name": "revsaw750",
            "category": "HCIM Weapons",
            "stats": {
                "DPS": {
                    "real": "111.42",
                    "theoretical": "156",
                    "critical": "467.98",
                    "theoretical_critical": "655.2"
                },
                "DPH": {
                    "total": "13",
                    "critical": "65"
                },
                "HPS": {
                    "real": "8.571",
                    "theoretical": "12"
                },
                "Melee Range": {
                    "range": "2.5",
                    "cleave_width": "1.5"
                }
            }
        },
        {
            "name": "akp",
            "category": "HCIM Weapons",
            "stats": {
                "DPS": {
                    "real": "119.99",
                    "theoretical": "136",
                    "critical": "503.94",
                    "theoretical_critical": "571.2"
                },
                "DPH": {
                    "total": "17 x 2 = 34",
                    "critical": "85"
                },
                "HPS": {
                    "real": "3.529",
                    "theoretical": "4"
                }
            }
        },
        {
            "name": "sawbladelauncher",
            "category": "HCIM Weapons",
            "stats": {
                "DPS": {
                    "real": "145.2",
                    "theoretical": "150",
                    "critical": "609.84",
                    "theoretical_critical": "630"
                },
                "DPH": {
                    "total": "75 + 75",
                    "critical": "375 + 375"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                }
            }
        },
        {
            "name": "dominatorm12",
            "category": "HCIM Weapons",
            "stats": {
                "DPS": {
                    "real": "523.58",
                    "theoretical": "576",
                    "critical": null,
                    "theoretical_critical": null
                },
                "DPH": {
                    "total": "[15.6 + 6 + 2.4] x 8 = 192",
                    "critical": null
                },
                "HPS": {
                    "real": "2.727",
                    "theoretical": "3"
                }
            }
        },
        {
            "name": "scrapshotsws88",
            "category": "HCIM Weapons",
            "stats": {
                "DPS": {
                    "real": "136.35",
                    "theoretical": "150",
                    "critical": "572.67",
                    "theoretical_critical": "630"
                },
                "DPH": {
                    "total": "12.5 + 12.5 + 12.5 + 12.5 = 50",
                    "critical": "62.5 + 62.5 + 62.5 + 62.5 = 250"
                },
                "HPS": {
                    "real": "2.727",
                    "theoretical": "3"
                }
            }
        },
        {
            "name": "siegecannon",
            "category": "HCIM Weapons",
            "stats": {
                "DPS": {
                    "real": "114.53",
                    "theoretical": "126",
                    "critical": "572.67",
                    "theoretical_critical": "630"
                },
                "DPH": {
                    "total": "42",
                    "critical": "210"
                },
                "HPS": {
                    "real": "2.727",
                    "theoretical": "3"
                }
            }
        },
        {
            "name": "im2combatsuit",
            "category": "HCIM Weapons",
            "stats": {}
        },
        {
            "name": "im2combathelmet",
            "category": "HCIM Weapons",
            "stats": {}
        },
        {
            "name": "im2implant",
            "category": "HCIM Weapons",
            "stats": {}
        },
        {
            "name": "titaniumblades",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "81.81",
                    "theoretical": "90",
                    "critical": "343.6",
                    "theoretical_critical": "378"
                },
                "DPH": {
                    "total": "30",
                    "critical": "150"
                },
                "HPS": {
                    "real": "2.727",
                    "theoretical": "3"
                },
                "Melee Range": {
                    "range": "1.5",
                    "cleave_width": "1"
                }
            }
        },
        {
            "name": "eviscerator",
            "category": "Chainsaws",
            "stats": {
                "DPS": {
                    "real": "93.34",
                    "theoretical": "120",
                    "critical": "392.04",
                    "theoretical_critical": "504"
                },
                "DPH": {
                    "total": "14",
                    "critical": "70"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                },
                "Melee Range": {
                    "range": "2.25",
                    "cleave_width": "3.4"
                }
            }
        },
        {
            "name": "gutstitcher",
            "category": "Sub-Machine Guns",
            "stats": {
                "DPS": {
                    "real": "500.05",
                    "theoretical": "642.86",
                    "critical": null,
                    "theoretical_critical": null
                },
                "DPH": {
                    "total": "75",
                    "critical": null
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                }
            }
        },
        {
            "name": "wraithcannonunlimitedammo",
            "category": "Heavy Machine Guns",
            "stats": {
                "DPS": {
                    "real": "547.85",
                    "theoretical": "771.44",
                    "critical": "591.68",
                    "theoretical_critical": "833.15"
                },
                "DPH": {
                    "total": "21 x 3 = 63",
                    "critical": "105"
                },
                "HPS": {
                    "real": "8.696",
                    "theoretical": "12.245"
                }
            }
        },
        {
            "name": "santaclaws",
            "category": "Melee Weapons",
            "stats": {
                "DPS": {
                    "real": "110.78",
                    "theoretical": "120",
                    "critical": "465.29",
                    "theoretical_critical": "504"
                },
                "DPH": {
                    "total": "48",
                    "critical": "240"
                },
                "HPS": {
                    "real": "2.308",
                    "theoretical": "2.5"
                },
                "Melee Range": {
                    "range": "2",
                    "cleave_width": "1.8"
                }
            }
        },
        {
            "name": "cryostormc1",
            "category": "Shotguns",
            "stats": {
                "DPS": {
                    "real": "618.75",
                    "theoretical": "660",
                    "critical": null,
                    "theoretical_critical": null
                },
                "DPH": {
                    "total": "33 x 10 = 330",
                    "critical": null
                },
                "HPS": {
                    "real": "1.875",
                    "theoretical": "2"
                }
            }
        },
        {
            "name": "panhammer",
            "category": "HCIM Weapons",
            "stats": {
                "DPS": {
                    "real": "125.84",
                    "theoretical": "130",
                    "critical": "528.53",
                    "theoretical_critical": "546"
                },
                "DPH": {
                    "total": "130",
                    "critical": "650"
                },
                "HPS": {
                    "real": "0.968",
                    "theoretical": "1"
                },
                "Melee Range": {
                    "range": "2.2",
                    "cleave_width": "1.8"
                }
            }
        },
        {
            "name": "rustwarden36",
            "category": "HCIM Weapons",
            "stats": {
                "DPS": {
                    "real": "500.05",
                    "theoretical": "642.86",
                    "critical": "580.06",
                    "theoretical_critical": "745.72"
                },
                "DPH": {
                    "total": "45 + 15 + 15 = 75",
                    "critical": "225 + 75 + 75 = 375"
                },
                "HPS": {
                    "real": "6.667",
                    "theoretical": "8.571"
                }
            }
        }
    ]
};
})();
