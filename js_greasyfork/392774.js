// ==UserScript==
// @name          Planets.nu - Meteor's Library
// @description   Library for Planets.nu with diverse globally available basic functions to serve other plugins.
// @namespace     Planets.nu
// @version       2.1
// @grant         none
// @date          2022-01-02
// @author        meteor
// @include       http://planets.nu/*
// @include       http://*.planets.nu/*
// @include       https://planets.nu/*
// @include       https://*.planets.nu/*
// @exclude       http://help.planets.nu/*
// @exclude       https://help.planets.nu/*
// @exclude       http://profile*.planets.nu/*
// @exclude       https://profile*.planets.nu/*
// @exclude       http://planets.nu/_library/*
// @exclude       http://api.planets.nu/*

// @downloadURL https://update.greasyfork.org/scripts/392774/Planetsnu%20-%20Meteor%27s%20Library.user.js
// @updateURL https://update.greasyfork.org/scripts/392774/Planetsnu%20-%20Meteor%27s%20Library.meta.js
// ==/UserScript==

/* -----------------------------------------------------------------------
 Change log:
 ----------------------------------------------------------------------- */

"use strict";

function wrapper(plugin_version)
{
    xLibrary = new XPlugin("Meteor's Library", "xLibrary", plugin_version, -20180626);

    xLibrary.setLogEnabled(false);

    xMapUtils.initialize();

    if (!xUtils.isMobileClient())
    {
        var css = "<style type='text/css'>";

        css += ".mapbutton {border-radius: 50%; position: absolute; right: 10px; font-size: 13px; color: #fff; width: 30px; height: 30px; cursor: pointer; text-align: center; vertical-align: middle; background-color: #333;}";
        css += ".mapbutton.toolactive {box-shadow: 0px 0px 0px 2px #00ffff;}";
        css += ".mapbutton:hover {opacity: 1;}";
        css += ".mapbutton::before {content: ''; font-family: 'Font Awesome 5 Free'; display: block; position: absolute; left:0; top:0; width: 30px; line-height: 30px; font-size: 14px; font-style: normal; font-variant: normal; text-rendering: auto; font-weight: 900; color: #00ffff; -webkit-font-smoothing: antialiased; text-align: center;}";
        css += ".mapbutton::after {content: ''; display:block; position:absolute; left: -10px; top:-10px; width: 50px; height: 50px;}";
        css += "#MapControls .mapbutton {position: relative; margin-bottom: 10px;}";

        css += "</style>";
        $("head:first").append(css);
    }
}

function global()
{
    var xLibrary;

    // -----------------------------------------------------------------------------------------------------------------

    function XPlugin(fullName, registerName, version, notetype, minLibraryVersion)
    {
        this.name = fullName;
        this.registerName = registerName;
        this.version = version;
        this.notetype = notetype;

        if ((typeof vgap == 'undefined') || (vgap == null))
        {
            window.alert("Cannot start " + fullName + "!\n\nThe plugin requires vgap.");
            throw "Cannot start " + fullName + ". vgap not found. Plugin disabled.";
        }

        if (vgap.version < 3.0)
        {
            throw "Cannot start " + fullName + ". Plugin requires at least NU version 3.0. Plugin disabled.";
        }

        if ((typeof minLibraryVersion != 'undefined') && (minLibraryVersion != null) && (xLibrary.getVersion() < minLibraryVersion))
        {
            window.alert("Cannot start " + fullName + "!\n\nThe plugin requires at least " + xLibrary.getName() + " version " + minLibraryVersion + ".\nVersion found: " + xLibrary.getVersion() + "\n\nPlease update the library!");
            throw "Cannot start " + fullName + ". Required " + xLibrary.getName() + " version " + minLibraryVersion + " not found. Plugin disabled.";
        }

        this.setLogEnabled(false);

        vgap.registerPlugin(this, registerName);

        console.log("Registered " + fullName + " (" + registerName + ") version: " + version);
    }

    XPlugin.prototype.getName = function()
    {
        return this.name;
    };

    XPlugin.prototype.getVersion = function()
    {
        return this.version;
    };

    XPlugin.prototype.saveObjectAsNote = function(id, obj)
    {
        let note = vgap.getNote(id, this.notetype);
        if (note == null)
        {
            note = vgap.addNote(id, this.notetype);
        }

        note.changed = 1;
        note.body = JSON.stringify(obj);

        vgap.save();
    };

    XPlugin.prototype.getObjectFromNote = function(id)
    {
        let note = vgap.getNote(id, this.notetype);
        if ((note == null) || (note.body == ""))
        {
            return null;
        }

        return JSON.parse(note.body);
    };

    XPlugin.prototype.log = function(message)
    {
        if (this.isLogEnabled())
        {
            console.log(this.getName() + "> " + message);
        }
    };

    XPlugin.prototype.logWarning = function(warning)
    {
        console.log(this.getName() + "> Warning: " + warning);
    };

    XPlugin.prototype.throwIllegalArgumentException = function(message)
    {
        throw this.getName() + "> IllegalArgumentException: " + message;
    };

    XPlugin.prototype.throwIllegalStateException = function(message)
    {
        throw this.getName() + "> IllegalStateException: " + message;
    };

    XPlugin.prototype.setLogEnabled = function(logEnabled)
    {
        this.logEnabled = logEnabled;
    };

    XPlugin.prototype.isLogEnabled = function()
    {
        return this.logEnabled;
    };

    XPlugin.prototype.processload = function()
    {
    };

    XPlugin.prototype.loadmap = function()
    {
    };

    XPlugin.prototype.draw = function()
    {
    };

    XPlugin.prototype.loaddashboard = function()
    {
    };

    XPlugin.prototype.showdashboard = function()
    {
    };

    XPlugin.prototype.showsummary = function()
    {
    };

    XPlugin.prototype.showmap = function()
    {
    };

    XPlugin.prototype.loadplanet = function()
    {
    };

    XPlugin.prototype.loadstarbase = function()
    {
    };

    XPlugin.prototype.loadship = function()
    {
    };

    // -----------------------------------------------------------------------------------------------------------------

    var xConst =
        {
            colRaceId:
                {
                    UNKNOWN: 0,
                    FEDERATION: 1,
                    LIZARDS: 2,
                    BIRDS: 3,
                    FASCISTS: 4,
                    PRIVATEERS: 5,
                    CYBORG: 6,
                    CRYSTALLINE: 7,
                    EMPIRE: 8,
                    ROBOTS: 9,
                    REBELS: 10,
                    COLONIES: 11,
                    HORWASP: 12
                },
            natRaceId:
                {
                    NONE: 0,
                    HUMANOID: 1,
                    BOVINOID: 2,
                    REPTILIAN: 3,
                    AVIAN: 4,
                    AMORPHOUS: 5,
                    INSECTOID: 6,
                    AMPHIBIAN: 7,
                    GHIPSOLDAL: 8,
                    SILICONOID: 9,
                    OTHER_PLAYER: 10
                },
            natGovernmentId:
                {
                    UNKNOWN: 0,
                    ANARCHY: 1,
                    PRE_TRIBAL: 2,
                    EARLY_TRIBAL: 3,
                    TRIBAL: 4,
                    FEUDAL: 5,
                    MONARCHY: 6,
                    REPRESENTATIVE: 7,
                    PARTICIPATORY: 8,
                    UNITY: 9,
                },
            sphereDuplication:
                {
                    NONE: 1,
                    FULL: 2,
                    ALPHA: 3
                },
            buildingThreshold:
                {
                    MINE: 200,
                    FACTORY: 100,
                    DEFENSE_POST: 50
                },
            shipFeature:
                {
                    CLOAK: 1,
                    DECLOAK: 2,
                    ADVANCED_CLOAK: 3,
                    RADIATION_SHIELDING: 4,
                    GLORY_DEVICE: 5,
                    GRAVITONIC: 6,
                    HYPERJUMP: 7,
                    RAMSCOOP: 8,
                    BIOSCAN: 9,
                    ADVANCED_BIOSCAN: 10,
                    NEBULA_SCANNER: 11,
                    TERRAFORMER: 12,
                    GAMBLING: 13,
                    ALCHEMY: 14,
                    CHUNNEL_INITIATOR: 15,
                    CHUNNEL_TARGET: 16,
                    IMPERIAL_ASSAULT: 17,
                    PLANET_IMMUNITY: 18,
                    SEND_FIGHTERS: 19,
                    RECEIVE_FIGHTERS: 20,
                    CHAMELEON_DEVICE: 21,
                    EMORKS_SPIRIT_BONUS: 22,
                    TIDAL_FORCE_SHIELD: 23,
                    CLOAKED_FIGHTER_BAYS: 24,
                    EDUCATOR: 25,
                    ORE_CONDENSOR: 26,
                    RECLOAK_INTERCEPT: 27,
                    SHIELD_GENERATOR: 28,
                    STEALTH_ARMOR: 29,
                    CHUNNEL_SELF: 30,
                    TEMPORAL_LANCE: 31,
                    CHUNNEL_STABILIZER: 32,
                    STARGATE: 33,
                    UNIVERSAL_CHUNNEL_TARGET: 34,
                    ELUSIVE: 35,
                    SQUADRON: 36,
                    WEBMINE_IMMUNITY: 37,
                    SUNBURST_DEVICE: 38,
                    MOVE_MINEFIELDS: 39,
                    REPAIR_SHIP: 40,
                    COMMAND_SHIP: 41,
                    TANTRUM_DEVICE: 42
                }

        };

    // -----------------------------------------------------------------------------------------------------------------

    var xUtils =
        {
            cloneShallow: function(object)
            {
                if (object == null)
                {
                    return null;
                }

                if (typeof object == "function")
                {
                    // expectation unclear: exception or return the specified object?
                    xLibrary.throwIllegalArgumentException("The specified object is a function. object = " + getLogString(object, [], 1));
                }

                if (typeof object != "object")
                {
                    return object;
                }

                let result = Object.create(object.constructor.prototype);

                Object.getOwnPropertyNames(object).forEach(function(propertyName)
                {
                    result[propertyName] = object[propertyName];
                });

                return result;
            },

            cloneDeep: function(object)
            {
                if (object == null)
                {
                    return null;
                }

                if (typeof object == "function")
                {
                    // expectation unclear: shallow clone, deep clone (feasible at all?), exception (rather not)?
                    return object;
                }

                if (typeof object != "object")
                {
                    return object;
                }

                let result = Object.create(object.constructor.prototype);

                Object.getOwnPropertyNames(object).forEach(function(propertyName)
                {
                    result[propertyName] = xUtils.cloneDeep(object[propertyName]);
                });

                return result;
            },

            assume: function(object, properties)
            {
                let result = Object.create(object);

                Object.getOwnPropertyNames(properties).forEach(function(propertyName)
                {
                    result[propertyName] = properties[propertyName];
                });

                return result;
            },

            update: function(object, properties)
            {
                Object.getOwnPropertyNames(properties).forEach(function(propertyName)
                {
                    object[propertyName] = properties[propertyName];
                });
            },

            getLogString: function(object, arExcludedPropertyNames, maxRecursionDepth)
            {
                let getLogStringImpl = function(object, arObjectsSeen, arExcludedPropertyNames, maxRecursionDepth)
                {
                    let str = object.constructor.name + "[";
                    let isFirst = true;

                    for ( let propertyName in object)
                    {
                        let propertyValue = object[propertyName];

                        if (!(propertyValue instanceof Function))
                        {
                            let propertyValueStr = null;

                            if (propertyValue instanceof Object)
                            {
                                if (arObjectsSeen.includes(propertyValue))
                                {
                                    propertyValueStr = "(cycle)";
                                }
                                else
                                {
                                    arObjectsSeen.push(propertyValue);

                                    if ((maxRecursionDepth > 0) && (!arExcludedPropertyNames.includes(propertyName)))
                                    {
                                        propertyValueStr = getLogStringImpl(propertyValue, arObjectsSeen, arExcludedPropertyNames, maxRecursionDepth - 1);
                                    }
                                    else
                                    {
                                        propertyValueStr = object.constructor.name + "[...]";
                                    }
                                }
                            }
                            else
                            {
                                propertyValueStr = arExcludedPropertyNames.includes(propertyName) ? "..." : propertyValue;
                            }

                            if (isFirst)
                            {
                                isFirst = false;
                            }
                            else
                            {
                                str += ", ";
                            }

                            str += propertyName + " = " + propertyValueStr;
                        }
                    }

                    str += "]";

                    return str;
                };

                let arObjectsSeen = [];
                arObjectsSeen.push(object);

                if (!arExcludedPropertyNames)
                {
                    arExcludedPropertyNames = [];
                }

                if (maxRecursionDepth == undefined || maxRecursionDepth == null || maxRecursionDepth < 0)
                {
                    maxRecursionDepth = Infinity;
                }

                return getLogStringImpl(object, arObjectsSeen, arExcludedPropertyNames, maxRecursionDepth);
            },

            isMobileClient: function()
            {
                return (vgap.version >= 4.0);
            },

            hasNatives: function(planet)
            {
                return planet.nativetype > 0;
            },

            getMaxColPop: function(planet)
            {
                let oldPlanet = vgap.planetScreen.planet;
                vgap.planetScreen.planet = planet;

                let maxCol = vgap.planetScreen.maxPop(false);

                vgap.planetScreen.planet = oldPlanet;

                return maxCol;
            },

            getMaxNatPop: function(planet)
            {
                if (!this.hasNatives(planet))
                {
                    return 0;
                }

                if (planet.nativetype == xConst.natRaceId.SILICONOID)
                {
                    return planet.temp * 1000;
                }

                return Math.round(Math.sin(3.14 * (100 - planet.temp) / 100) * 150000);
            },

            getNativeTaxRatio: function(planet)
            {
                let oldPlanet = vgap.planetScreen.planet;
                vgap.planetScreen.planet = this.assume(planet,
                    {
                        clans: 1,
                        nativetaxrate: 100
                    });

                let nativeTaxRatio = vgap.planetScreen.nativeTaxAmount();

                vgap.planetScreen.planet = oldPlanet;

                return nativeTaxRatio;
            },

            getMinColsForBuildings: function(countBuildings, buildingType)
            {
                if (countBuildings <= buildingType)
                {
                    return countBuildings;
                }

                return buildingType + ((countBuildings - buildingType) * (countBuildings - buildingType));
            },

            getMaxBuildings: function(planet, buildingThreshold)
            {
                if (planet.clans <= buildingThreshold)
                {
                    return planet.clans;
                }

                return Math.floor(buildingThreshold + Math.sqrt(planet.clans - buildingThreshold));
            },

            createColTaxTable: function(planet)
            {
                let oldPlanet = vgap.planetScreen.planet;
                vgap.planetScreen.planet = planet;

                let oldColTaxRate = planet.colonisttaxrate;

                let table = [];

                for (let taxRate = 0; taxRate < 101; taxRate++)
                {
                    planet.colonisttaxrate = taxRate;
                    let taxAmount = vgap.planetScreen.colonistTaxAmount();
                    let possibleTaxAmount = taxAmount;
                    let happinessChange = vgap.colonistTaxChange(planet);
                    let happiness = planet.colonisthappypoints + happinessChange;
                    if (happiness > 100)
                        happiness = 100;

                    let absoluteGrowth = vgap.planetScreen.colPopGrowth() * 100;
                    let relativeGrowth = absoluteGrowth / planet.clans;

                    table[taxRate] =
                        {
                            taxRate: taxRate,
                            taxAmount: taxAmount,
                            possibleTaxAmount: possibleTaxAmount,
                            happiness: happiness,
                            happinessChange: happinessChange,
                            absoluteGrowth: absoluteGrowth,
                            relativeGrowth: relativeGrowth
                        };
                }

                planet.colonisttaxrate = oldColTaxRate;
                vgap.planetScreen.planet = oldPlanet;

                return table;
            },

            createNatTaxTable: function(planet)
            {
                if (!this.hasNatives(planet))
                {
                    return null;
                }

                let oldPlanet = vgap.planetScreen.planet;
                vgap.planetScreen.planet = planet;

                let oldNatTaxRate = planet.nativetaxrate;

                let table = [];

                for (let taxRate = 0; taxRate < 101; taxRate++)
                {
                    planet.nativetaxrate = taxRate;
                    let taxAmount = vgap.planetScreen.nativeTaxAmount();
                    let possibleTaxAmount = vgap.planetScreen.nativeTaxAmount(true);
                    let happinessChange = vgap.nativeTaxChange(planet);
                    let happiness = planet.nativehappypoints + happinessChange;
                    if (happiness > 100)
                        happiness = 100;

                    let absoluteGrowth = vgap.planetScreen.nativePopGrowth() * 100;
                    let relativeGrowth = absoluteGrowth / planet.nativeclans;

                    table[taxRate] =
                        {
                            taxRate: taxRate,
                            taxAmount: taxAmount,
                            possibleTaxAmount: possibleTaxAmount,
                            happiness: happiness,
                            happinessChange: happinessChange,
                            absoluteGrowth: absoluteGrowth,
                            relativeGrowth: relativeGrowth
                        };
                }

                planet.nativetaxrate = oldNatTaxRate;
                vgap.planetScreen.planet = oldPlanet;

                return table;
            },

            getMaxFullCollectableTaxEntry: function(taxTable)
            {
                for (let i = taxTable.length - 1; i >= 0; i--)
                {
                    let entry = taxTable[i];
                    if (entry.taxAmount == entry.possibleTaxAmount)
                    {
                        return entry;
                    }
                }

                return taxTable[0];
            },

            getMaxTaxEntryByHappinessChange: function(taxTable, happinessChange)
            {
                for (let i = taxTable.length - 1; i >= 0; i--)
                {
                    let entry = taxTable[i];
                    if (entry.happinessChange >= happinessChange)
                    {
                        return entry;
                    }
                }

                return taxTable[0];
            },

            isSharingIntel: function(playerToId)
            {
                let relation = vgap.getRelation(playerToId);
                if (relation == null)
                {
                    return false;
                }

                return relation.relationto >= 3;
            },

            hasFeature: function(ship, feature)
            {
                switch (feature)
                {
                    case xConst.shipFeature.CLOAK:
                    {
                        let hull = vgap.getHull(ship.hullid);
                        return hull.cancloak;
                    }
                    case xConst.shipFeature.DECLOAK:
                    {
                        return (ship.hullid == 7);
                    }
                    case xConst.shipFeature.ADVANCED_CLOAK:
                    {
                        return ((ship.hullid == 29) || (ship.hullid == 31) || (ship.hullid == 1047) || (ship.hullid == 3033));
                    }
                    case xConst.shipFeature.RADIATION_SHIELDING:
                    {
                        // TODO: untested: 107 ore condensor from client code (docu doesn't say it)
                        return ((ship.hullid == 6) || (ship.hullid == 33) || (ship.hullid == 34) || (ship.hullid == 35) || (ship.hullid == 36) || (ship.hullid == 37) || (ship.hullid == 38) || (ship.hullid == 39) || (ship.hullid == 40) || (ship.hullid == 41) || (ship.hullid == 68) || (ship.hullid == 93) || (ship.hullid == 107) || (ship.hullid == 120) || (ship.hullid == 1006) || (ship.hullid == 1033) || (ship.hullid == 1034) || (ship.hullid == 1038) || (ship.hullid == 1039) || (ship.hullid == 1041) || (ship.hullid == 1068) || (ship.hullid == 1093) || (ship.hullid == 2006) || (ship.hullid == 2033) || (ship.hullid == 2038) || (ship.hullid == 3033));
                    }
                    case xConst.shipFeature.GLORY_DEVICE:
                    {
                        return ((ship.hullid == 39) || (ship.hullid == 41) || (ship.hullid == 1034) || (ship.hullid == 1039) || (ship.hullid == 1041));
                    }
                    case xConst.shipFeature.GRAVITONIC:
                    {
                        return ((ship.hullid == 44) || (ship.hullid == 45) || (ship.hullid == 46));
                    }
                    case xConst.shipFeature.HYPERJUMP:
                    {
                        return ((ship.hullid == 51) || (ship.hullid == 77) || (ship.hullid == 87) || (ship.hullid == 110));
                    }
                    case xConst.shipFeature.RAMSCOOP:
                    {
                        return (ship.hullid == 96);
                    }
                    case xConst.shipFeature.BIOSCAN:
                    {
                        return ((ship.hullid == 9) || (ship.hullid == 84) || (ship.hullid == 96) || (ship.hullid == 1084));
                    }
                    case xConst.shipFeature.ADVANCED_BIOSCAN:
                    {
                        return ((ship.hullid == 84) || (ship.hullid == 1084));
                    }
                    case xConst.shipFeature.NEBULA_SCANNER:
                    {
                        return ((ship.hullid == 27) || (ship.hullid == 54) || (ship.hullid == 1054));
                    }
                    case xConst.shipFeature.TERRAFORMER:
                    {
                        return ((ship.hullid == 3) || (ship.hullid == 8) || (ship.hullid == 64));
                    }
                    case xConst.shipFeature.GAMBLING:
                    {
                        return (ship.hullid == 42);
                    }
                    case xConst.shipFeature.ALCHEMY:
                    {
                        return ((ship.hullid == 97) || (ship.hullid == 104) || (ship.hullid == 105));
                    }
                    case xConst.shipFeature.CHUNNEL_INITIATOR:
                    {
                        return ((ship.hullid == 56) || (ship.hullid == 1055));
                    }
                    case xConst.shipFeature.CHUNNEL_TARGET:
                    {
                        return ((ship.hullid == 56) || (ship.hullid == 108) || (ship.hullid == 114) || (ship.hullid == 1054)); // || (ship.hullid == 51) // B200 can be a target of a B222b, but not general. Add it here or not???
                    }
                    case xConst.shipFeature.IMPERIAL_ASSAULT:
                    {
                        return (ship.hullid == 69);
                    }
                    case xConst.shipFeature.PLANET_IMMUNITY:
                    {
                        return ((ship.hullid == 69) || (ship.hullid == 1065) || (ship.hullid == 1071) || (ship.hullid == 2065) || (ship.hullid == 2071));
                    }
                    case xConst.shipFeature.SEND_FIGHTERS:
                    {
                        return (ship.hullid == 70);
                    }
                    case xConst.shipFeature.RECEIVE_FIGHTERS:
                    {
                        return (ship.hullid == 70);
                    }
                    case xConst.shipFeature.CHAMELEON_DEVICE:
                    {
                        return ((ship.hullid == 109) || (ship.hullid == 1023) || (ship.hullid == 1049));
                    }
                    case xConst.shipFeature.EMORKS_SPIRIT_BONUS:
                    {
                        return (ship.hullid == 112);
                    }
                    case xConst.shipFeature.TIDAL_FORCE_SHIELD:
                    {
                        return (ship.hullid == 112);
                    }
                    case xConst.shipFeature.CLOAKED_FIGHTER_BAYS:
                    {
                        return (ship.hullid == 1047);
                    }
                    case xConst.shipFeature.EDUCATOR:
                    {
                        return (ship.hullid == 106);
                    }
                    case xConst.shipFeature.ORE_CONDENSER:
                    {
                        return (ship.hullid == 107);
                    }
                    case xConst.shipFeature.RECLOAK_INTERCEPT:
                    {
                        return (ship.hullid == 2033);
                    }
                    case xConst.shipFeature.SHIELD_GENERATOR:
                    {
                        return (ship.hullid == 1041);
                    }
                    case xConst.shipFeature.STEALTH_ARMOR:
                    {
                        return ((ship.hullid == 120) || (ship.hullid == 1050));
                    }
                    case xConst.shipFeature.CHUNNEL_SELF:
                    {
                        return (ship.hullid == 1055);
                    }
                    case xConst.shipFeature.TEMPORAL_LANCE:
                    {
                        return (ship.hullid == 114);
                    }
                    case xConst.shipFeature.CHUNNEL_STABILIZER:
                    {
                        return (ship.hullid == 108);
                    }
                    case xConst.shipFeature.STARGATE:
                    {
                        return (ship.hullid == 108);
                    }
                    case xConst.shipFeature.UNIVERSAL_CHUNNEL_TARGET:
                    {
                        return (ship.hullid == 108);
                    }
                    case xConst.shipFeature.ELUSIVE:
                    {
                        return ((ship.hullid == 1065) || (ship.hullid == 1071) || (ship.hullid == 2065) || (ship.hullid == 2071));
                    }
                    case xConst.shipFeature.SQUADRON:
                    {
                        return ((ship.hullid == 1065) || (ship.hullid == 1071) || (ship.hullid == 2065) || (ship.hullid == 2071));
                    }
                    case xConst.shipFeature.WEBMINE_IMMUNITY:
                    {
                        return (ship.hullid == 110);
                    }
                    case xConst.shipFeature.SUNBURST_DEVICE:
                    {
                        return (ship.hullid == 1064);
                    }
                    case xConst.shipFeature.MOVE_MINEFIELDS:
                    {
                        return (ship.hullid == 113);
                    }
                    case xConst.shipFeature.REPAIR_SHIP:
                    {
                        return (ship.hullid == 1090);
                    }
                    case xConst.shipFeature.COMMAND_SHIP:
                    {
                        return (ship.hullid == 1089);
                    }
                    case xConst.shipFeature.TANTRUM_DEVICE:
                    {
                        return (ship.hullid == 111);
                    }
                }

                return false;
            }
        };

    // #################################################################################################################

    var xMapUtils =
        {
            getMapCenterCoordinates: function()
            {
                return this._mapCenterCoordinates;
            },

            getSphereBorderAddition: function()
            {
                return this._sphereBorderAddition;
            },

            getMapWidth: function()
            {
                return vgap.settings.mapwidth + (vgap.settings.sphere ? 2 * this.getSphereBorderAddition().getWidth() : 0);
            },

            getMapHeight: function()
            {
                return vgap.settings.mapheight + (vgap.settings.sphere ? 2 * this.getSphereBorderAddition().getHeight() : 0);
            },

            getMaxCoordinatesRect: function()
            {
                let mapWidth = this.getMapWidth() - (vgap.settings.sphere ? 1 : 0);
                let mapHeight = this.getMapHeight() - (vgap.settings.sphere ? 1 : 0);
                let mapCenter = this.getMapCenterCoordinates();

                let x1 = Math.floor(mapCenter.x - mapWidth / 2);
                let y1 = Math.floor(mapCenter.y - mapHeight / 2);
                let x2 = Math.floor(mapCenter.x + mapWidth / 2);
                let y2 = Math.floor(mapCenter.y + mapHeight / 2);

                return new XRect(x1, y1, x2, y2);
            },

            getMapBoundingRect: function()
            {
                return this.getMaxCoordinatesRect().enlargeXY(0.5, 0.5);
            },

            getSphereDuplicationBoundingRect: function()
            {
                return this.getMapBoundingRect().enlargeXY(vgap.accountsettings.sphereduplicate, vgap.accountsettings.sphereduplicate);
            },

            getHeadingXY: function(x1, y1, x2, y2)
            {
                return vgap.getHeading(x1, y1, x2, y2);
            },

            getHeading: function(point1, point2)
            {
                return vgap.getHeading(point1.x, point1.y, point2.x, point2.y);
            },

            getOneDimensionalSphereDistance: function(c1, c2, sphereSize)
            {
                let dist = Math.abs(c1 - c2);

                if (vgap.settings.sphere)
                {
                    while (dist > (sphereSize / 2))
                    {
                        dist = Math.abs(dist - sphereSize);
                    }
                }

                return dist;
            },

            getSphereDistanceXY: function(x1, y1, x2, y2)
            {
                let xDiff = this.getOneDimensionalSphereDistance(x1, x2, this.getMapWidth());
                let yDiff = this.getOneDimensionalSphereDistance(y1, y2, this.getMapHeight());

                return Math.sqrt((xDiff * xDiff) + (yDiff * yDiff));
            },

            getSphereDistance: function(pointlikeObject1, pointlikeObject2)
            {
                return this.getSphereDistanceXY(pointlikeObject1.x, pointlikeObject1.y, pointlikeObject2.x, pointlikeObject2.y);
            },

            screenX: function(x)
            {
                return Math.round((x - vgap.map.canvas.x) * vgap.map.zoom) + 0.5;
            },

            screenY: function(y)
            {
                return vgap.map.canvas.height - (Math.round((y - vgap.map.canvas.y) * vgap.map.zoom) + 0.5);
            },

            hasNebulas: function()
            {
                return (vgap.nebulas && (vgap.nebulas.length > 0));
            },

            getNebulaVisibilityFromIntensity: function(nebulaIntensity)
            {
                return Math.round(4000 / (nebulaIntensity + 1));
            },

            getNebulaVisibility: function(point)
            {
                let intensity = vgap.getNebulaIntensity(point.x, point.y);

                return this.getNebulaVisibilityFromIntensity(intensity);
            },

            getNebulaVisibilityXY: function(x, y)
            {
                let intensity = this.getNebulaIntensityXY(x, y);

                return this.getNebulaVisibilityFromIntensity(intensity);
            },

            getNebulaIntensityXY: function(x, y)
            {
                let intensity = 0;

                if (this.hasNebulas())
                {
                    for (let i = 0; i < vgap.nebulas.length; i++)
                    {
                        let nebula = vgap.nebulas[i];

                        if (nebula.id < 0) // sphere duplicated nebula
                        {
                            continue;
                        }

                        let dist = this.getSphereDistanceXY(nebula.x, nebula.y, x, y);

                        if (dist <= nebula.radius)
                        {
                            intensity += Math.ceil(nebula.intensity * (1 - (dist / nebula.radius)));
                        }
                    }
                }

                return intensity;
            },

            drawLineSection: function(section, drawParams)
            {
                if (section == null)
                {
                    return;
                }

                let ctx = vgap.map.ctx;

                ctx.strokeStyle = drawParams.strokeStyle;
                ctx.lineWidth = drawParams.lineWidth;

                if (!vgap.settings.sphere)
                {
                    ctx.beginPath();
                    ctx.moveTo(xMapUtils.screenX(section.x1), xMapUtils.screenY(section.y1));
                    ctx.lineTo(xMapUtils.screenX(section.x2), xMapUtils.screenY(section.y2));
                    ctx.closePath();
                    ctx.stroke();

                    return;
                }

                let mapBoundingRect = this.getMapBoundingRect();
                let sphereDuplicationBoundingRect = this.getSphereDuplicationBoundingRect();

                let mapWidth = mapBoundingRect.getWidth();
                let mapHeight = mapBoundingRect.getHeight();

                let sphereClipRects = [];
                let delta = XPoint.minDistance();
                sphereClipRects.push(new XRect(sphereDuplicationBoundingRect.left, sphereDuplicationBoundingRect.bottom, mapBoundingRect.left - delta, sphereDuplicationBoundingRect.top));
                sphereClipRects.push(new XRect(mapBoundingRect.right + delta, sphereDuplicationBoundingRect.bottom, sphereDuplicationBoundingRect.right, sphereDuplicationBoundingRect.top));
                sphereClipRects.push(new XRect(mapBoundingRect.left, mapBoundingRect.top + delta, mapBoundingRect.right, sphereDuplicationBoundingRect.top));
                sphereClipRects.push(new XRect(mapBoundingRect.left, sphereDuplicationBoundingRect.bottom, mapBoundingRect.right, mapBoundingRect.bottom - delta));

                let collectSections = function(section, normalSections, sphereSections)
                {
                    let clippedSection = section.clip(mapBoundingRect);
                    if (clippedSection)
                    {
                        normalSections.push(clippedSection);
                    }

                    if (vgap.settings.sphere)
                    {
                        for (let i = 0; i < sphereClipRects.length; i++)
                        {
                            clippedSection = section.clip(sphereClipRects[i]);
                            if (clippedSection)
                            {
                                sphereSections.push(clippedSection);
                            }
                        }
                    }
                };

                let normalSections = [];
                let sphereSections = [];

                collectSections(section, normalSections, sphereSections);

                if (vgap.settings.sphere)
                {
                    collectSections(section.offsetXY(-mapWidth, -mapHeight), normalSections, sphereSections);
                    collectSections(section.offsetXY(-mapWidth, 0), normalSections, sphereSections);
                    collectSections(section.offsetXY(-mapWidth, +mapHeight), normalSections, sphereSections);
                    collectSections(section.offsetXY(0, -mapHeight), normalSections, sphereSections);
                    collectSections(section.offsetXY(0, +mapHeight), normalSections, sphereSections);
                    collectSections(section.offsetXY(+mapWidth, -mapHeight), normalSections, sphereSections);
                    collectSections(section.offsetXY(+mapWidth, 0), normalSections, sphereSections);
                    collectSections(section.offsetXY(+mapWidth, +mapHeight), normalSections, sphereSections);
                }

                for (let i = 0; i < normalSections.length; i++)
                {
                    let curSection = normalSections[i];

                    ctx.beginPath();
                    ctx.moveTo(xMapUtils.screenX(curSection.x1), xMapUtils.screenY(curSection.y1));
                    ctx.lineTo(xMapUtils.screenX(curSection.x2), xMapUtils.screenY(curSection.y2));
                    ctx.closePath();
                    ctx.stroke();
                }

                if ((drawParams.sphereDuplication == xConst.sphereDuplication.FULL) || (drawParams.sphereDuplication == xConst.sphereDuplication.ALPHA))
                {
                    if (drawParams.sphereDuplication == xConst.sphereDuplication.ALPHA)
                    {
                        ctx.strokeStyle = colorToRGBA(drawParams.strokeStyle, 0.5);
                    }

                    for (i = 0; i < sphereSections.length; i++)
                    {
                        curSection = sphereSections[i];

                        ctx.beginPath();
                        ctx.moveTo(xMapUtils.screenX(curSection.x1), xMapUtils.screenY(curSection.y1));
                        ctx.lineTo(xMapUtils.screenX(curSection.x2), xMapUtils.screenY(curSection.y2));
                        ctx.closePath();
                        ctx.stroke();
                    }
                }
            },

            drawRect: function(rect, drawParams)
            {
                if (rect == null)
                {
                    return;
                }

                this.drawLineSection(rect.getLeftSection(), drawParams);
                this.drawLineSection(rect.getRightSection(), drawParams);
                this.drawLineSection(rect.getTopSection(), drawParams);
                this.drawLineSection(rect.getBottomSection(), drawParams);
            },

            addMapTool: function(text, cls, onclick, target)
            {
                if (xUtils.isMobileClient())
                {
                    vgap.map.addMapTool(text, cls, onclick, target);
                    return;
                }

                if (!target || (target == "#MapControls"))
                {
                    $("<li class='" + cls + "'>" + text + "</li>").tclick(onclick).appendTo("#MapTools");
                    return;
                }

                $("<div class='mapbutton " + cls + "' title='" + text + "'></div>").tclick(function(e)
                {
                    if (onclick)
                        onclick(e);
                }).appendTo(target);
            },

            activateToggleMapTools: function(isToggleMapToolsActive)
            {
                this._isToggleMapToolsActive = isToggleMapToolsActive;

                if (isToggleMapToolsActive)
                {
                    $("#MapToolsMenu").show();
                }
                else
                {
                    $("#MapToolsMenu").hide();
                }
            },

            initialize: function()
            {
                this._mapCenterCoordinates = new XPoint(2000, 2000);
                this._sphereBorderAddition = new XDimension(10, 10);
                this._isToggleMapToolsActive = true;
            }
        };

    xMapUtils.oldToggleTools = vgapMap.prototype.toggleTools;
    vgapMap.prototype.toggleTools = function()
    {
        if (!xMapUtils._isToggleMapToolsActive || (typeof xMapUtils.oldToggleTools == 'undefined') || (xMapUtils.oldToggleTools == null))
        {
            return;
        }

        xMapUtils.oldToggleTools.apply(this, arguments);
    };

    // -----------------------------------------------------------------------------------------------------------------

    const X_POINTS_PER_LIGHTYEAR = 4096;

    function XPoint(x, y)
    {
        this.x = XPoint.roundCoordinate(x);
        this.y = XPoint.roundCoordinate(y);
    }

    XPoint.fromPoint = function(pointlikeObject)
    {
        return new XPoint(pointlikeObject.x, pointlikeObject.y);
    };

    XPoint.roundCoordinate = function(c)
    {
        return Math.round(c * X_POINTS_PER_LIGHTYEAR) / X_POINTS_PER_LIGHTYEAR;
    };

    XPoint.minDistance = function()
    {
        return 1 / X_POINTS_PER_LIGHTYEAR;
    };

    XPoint.prototype.equalsXY = function(x, y)
    {
        return ((this.x == XPoint.roundCoordinate(x)) && (this.y == XPoint.roundCoordinate(y)));
    };

    XPoint.prototype.equals = function(pointlikeObject)
    {
        if (pointlikeObject == null)
        {
            return false;
        }

        if (pointlikeObject instanceof XPoint)
        {
            return ((this.x == pointlikeObject.x) && (this.y == pointlikeObject.y));
        }

        return this.equalsXY(pointlikeObject.x, pointlikeObject.y);
    };

    XPoint.prototype.getLogString = function()
    {
        return "XPoint(" + this.x + ", " + this.y + ")";
    };

    XPoint.prototype.offsetXY = function(dx, dy)
    {
        return new XPoint(this.x + dx, this.y + dy);
    };

    // -----------------------------------------------------------------------------------------------------------------

    function XDimension(width, height)
    {
        this.width = XPoint.roundCoordinate(width);
        this.height = XPoint.roundCoordinate(height);
    }

    XDimension.prototype.equals = function(dimension)
    {
        if (dimension == null)
        {
            return false;
        }

        return (this.width == dimension.width) && (this.height == dimension.height);
    };

    XDimension.prototype.getLogString = function()
    {
        return "XDimension(" + this.width + ", " + this.height + ")";
    };

    XDimension.prototype.getWidth = function()
    {
        return this.width;
    };

    XDimension.prototype.getHeight = function()
    {
        return this.height;
    };

    // -----------------------------------------------------------------------------------------------------------------

    function XRect(x1, y1, x2, y2)
    {
        this.left = XPoint.roundCoordinate((x1 < x2) ? x1 : x2);
        this.bottom = XPoint.roundCoordinate((y1 < y2) ? y1 : y2);
        this.right = XPoint.roundCoordinate((x1 < x2) ? x2 : x1);
        this.top = XPoint.roundCoordinate((y1 < y2) ? y2 : y1);
    }

    XRect.fromPoints = function(pointlikeObject1, pointlikeObject2)
    {
        return new XRect(pointlikeObject1.x, pointlikeObject1.y, pointlikeObject2.x, pointlikeObject2.y);
    };

    XRect.prototype.equals = function(rect)
    {
        if (rect == null)
        {
            return false;
        }

        return ((this.left == rect.left) && (this.bottom == rect.bottom) && (this.right == rect.right) && (this.top == rect.top));
    };

    XRect.prototype.getLogString = function()
    {
        return "XRect(" + this.left + ", " + this.bottom + ", " + this.right + ", " + this.top + ")";
    };

    XRect.prototype.getWidth = function()
    {
        return this.right - this.left;
    };

    XRect.prototype.getHeight = function()
    {
        return this.top - this.bottom;
    };

    XRect.prototype.getDimension = function()
    {
        return new XDimension(this.getWidth(), this.getHeight());
    };

    XRect.prototype.getLeftSection = function()
    {
        return new XLineSection(this.left, this.bottom, this.left, this.top);
    };

    XRect.prototype.getBottomSection = function()
    {
        return new XLineSection(this.left, this.bottom, this.right, this.bottom);
    };

    XRect.prototype.getRightSection = function()
    {
        return new XLineSection(this.right, this.bottom, this.right, this.top);
    };

    XRect.prototype.getTopSection = function()
    {
        return new XLineSection(this.left, this.top, this.right, this.top);
    };

    XRect.prototype.getLeftBottomPoint = function()
    {
        return new XPoint(this.left, this.bottom);
    };

    XRect.prototype.getRightBottomPoint = function()
    {
        return new XPoint(this.right, this.bottom);
    };

    XRect.prototype.getLeftTopPoint = function()
    {
        return new XPoint(this.left, this.top);
    };

    XRect.prototype.getRightTopPoint = function()
    {
        return new XPoint(this.right, this.top);
    };

    XRect.prototype.getCenterPoint = function()
    {
        return new XPoint((this.left + this.right) * 0.5, (this.bottom + this.top) * 0.5);
    };

    XRect.prototype.enlargeXY = function(x, y)
    {
        return new XRect(this.left - x, this.bottom - y, this.right + x, this.top + y);
    };

    XRect.prototype.enlarge = function(dimension)
    {
        return this.enlarge(dimension.width, dimension.height);
    };

    XRect.prototype.containsXY = function(x, y)
    {
        return ((x >= this.left) && (x <= this.right) && (y >= this.bottom) && (y <= this.top));
    };

    XRect.prototype.containsPoint = function(pointlikeObject)
    {
        if (pointlikeObject == null)
        {
            return false;
        }

        return this.containsXY(pointlikeObject.x, pointlikeObject.y);
    };

    // -----------------------------------------------------------------------------------------------------------------

    // a*x + b*y = c
    function XLine(a, b, c)
    {
        let a1 = a;
        let b1 = b;
        let c1 = c;

        if (b != 0)
        {
            if (b != 1)
            {
                a1 = a / b;
                b1 = 1;
                c1 = c / b;
            }
        }
        else if (a != 0)
        {
            if (a != 1)
            {
                a1 = 1;
                b1 = 0;
                c1 = c / a;
            }
        }
        else
        {
            xLibrary.throwIllegalArgumentException("XLine: Cannot create line. The specified parameters a and b both are 0.");
        }

        this.a = a1;
        this.b = b1;
        this.c = c1;
    }

    XLine.prototype.getLogString = function()
    {
        return "XLine(" + this.a + ", " + this.b + ", " + this.c + ")";
    };

    XLine.fromXY = function(x1, y1, x2, y2)
    {
        if ((x1 == x2) && (y1 == y2))
        {
            xLibrary.throwIllegalArgumentException("XLine.fromXY(): Cannot create line. The specified points are identical. points = (" + x1 + ", " + y1 + ")");
        }

        return new XLine(y1 - y2, x2 - x1, x2 * y1 - x1 * y2);
    };

    XLine.fromPoints = function(pointlikeObject1, pointlikeObject2)
    {
        return XLine.fromXY(pointlikeObject1.x, pointlikeObject1.y, pointlikeObject2.x, pointlikeObject2.y);
    };

    XLine.getPerpendicularBisector = function(pointlikeObject1, pointlikeObject2)
    {
        let x1 = pointlikeObject1.x;
        let y1 = pointlikeObject1.y;
        let x2 = pointlikeObject2.x;
        let y2 = pointlikeObject2.y;

        if (y1 == y2)
        {
            if (x1 == x2)
            {
                xLibrary.throwIllegalArgumentException("XLine.getPerpendicularBisector(): Cannot calculate the perpendicular bisector. The specified points are identical. points = (" + x1 + ", " + y1 + ")");
            }

            return new XLine(1, 0, (x1 + x2) / 2);
        }

        let a = (x1 - x2) / (y1 - y2);
        let c = (x1 * x1 - x2 * x2 + y1 * y1 - y2 * y2) / (2 * (y1 - y2));

        return new XLine(a, 1, c);
    };

    XLine.prototype.getIntersectionPoint = function(lineOrLineSection)
    {
        if (lineOrLineSection instanceof (XLineSection))
        {
            return lineOrLineSection.getIntersectionPoint(this);
        }

        let line2 = lineOrLineSection;

        let a1 = this.a;
        let b1 = this.b;
        let c1 = this.c;

        let a2 = line2.a;
        let b2 = line2.b;
        let c2 = line2.c;

        let d = a1 * b2 - a2 * b1;

        if (d == 0) // parallel (incl. identical)
        {
            return null;
        }

        let x = (b2 * c1 - b1 * c2) / d;
        let y = (a1 * c2 - a2 * c1) / d;

        return new XPoint(x, y);
    };

    XLine.prototype.isVertical = function()
    {
        return (this.b == 0);
    };

    XLine.prototype.isHorizontal = function()
    {
        return (this.a == 0);
    };

    XLine.prototype.getPointFromX = function(x)
    {
        if (this.b == 0)
        {
            return null;
        }

        let xNormalized = XPoint.roundCoordinate(x);

        return new XPoint(xNormalized, (this.c - this.a * xNormalized) / this.b);
    };

    XLine.prototype.getPointFromY = function(y)
    {
        if (this.a == 0)
        {
            return null;
        }

        let yNormalized = XPoint.roundCoordinate(y);

        return new XPoint((this.c - this.b * yNormalized) / this.a, yNormalized);
    };

    XLine.prototype.getHeading = function()
    {
        let heading = xMapUtils.getHeadingXY(0, 0, this.a, this.b) + 90;
        while (heading >= 180)
        {
            heading -= 180;
        }

        return heading;
    };

    XLine.prototype.clip = function(rect)
    {
        let ip = [];
        ip.push(rect.getLeftSection().getIntersectionPoint(this));
        ip.push(rect.getRightSection().getIntersectionPoint(this));
        ip.push(rect.getBottomSection().getIntersectionPoint(this));
        ip.push(rect.getTopSection().getIntersectionPoint(this));

        let p1 = null;
        let p2 = null;

        for (var i = 0; (p1 == null) && (i < ip.length); i++)
        {
            p1 = ip[i];
        }

        for (; (p2 == null) && (i < ip.length); i++)
        {
            p2 = ip[i];
        }

        if ((p1 == null) || (p2 == null) || p1.equals(p2))
        {
            return null;
        }

        return XLineSection.fromPoints(p1, p2);
    };

    // -----------------------------------------------------------------------------------------------------------------

    function XLineSection(x1, y1, x2, y2)
    {
        this.x1 = XPoint.roundCoordinate(x1);
        this.y1 = XPoint.roundCoordinate(y1);
        this.x2 = XPoint.roundCoordinate(x2);
        this.y2 = XPoint.roundCoordinate(y2);

        if ((this.x1 == this.x2) && (this.y1 == this.y2))
        {
            xLibrary.throwIllegalArgumentException("XLineSection: Cannot create line section. The specified points are identical. points = (" + this.x1 + ", " + this.y1 + ")");
        }
    }

    XLineSection.fromPoints = function(pointlikeObject1, pointlikeObject2)
    {
        return new XLineSection(pointlikeObject1.x, pointlikeObject1.y, pointlikeObject2.x, pointlikeObject2.y);
    };

    XLineSection.prototype.equals = function(lineSection)
    {
        if (lineSection == null)
        {
            return false;
        }

        return ((this.x1 == lineSection.x1) && (this.y1 == lineSection.y1) && (this.x2 == lineSection.x2) && (this.y2 == lineSection.y2));
    };

    XLineSection.prototype.getLogString = function()
    {
        return "XLineSection(" + this.x1 + ", " + this.y1 + ", " + this.x2 + ", " + this.y2 + ")";
    };

    XLineSection.prototype.getLine = function()
    {
        return XLine.fromXY(this.x1, this.y1, this.x2, this.y2);
    };

    XLineSection.prototype.getBoundingRect = function()
    {
        return new XRect(this.x1, this.y1, this.x2, this.y2);
    };

    XLineSection.prototype.isVertical = function()
    {
        return (this.x1 == this.x2);
    };

    XLineSection.prototype.isHorizontal = function()
    {
        return (this.y1 == this.y2);
    };

    XLineSection.prototype.offsetXY = function(dx, dy)
    {
        return new XLineSection(this.x1 + dx, this.y1 + dy, this.x2 + dx, this.y2 + dy);
    };

    XLineSection.prototype.offsetDimension = function(dimension)
    {
        return this.offsetXY(dimension.getWidth(), dimension.getHeight());
    };

    XLineSection.prototype.getIntersectionPoint = function(lineOrLineSection)
    {
        let isParamLineSection = (lineOrLineSection instanceof (XLineSection));

        let line1 = this.getLine();
        let line2 = (isParamLineSection ? lineOrLineSection.getLine() : lineOrLineSection);

        let point = line1.getIntersectionPoint(line2);

        if ((point != null) && this.getBoundingRect().containsPoint(point) && (!isParamLineSection || lineOrLineSection.getBoundingRect().containsPoint(point)))
        {
            return point;
        }

        return null;
    };

    XLineSection.prototype.getCenterPoint = function()
    {
        return new XPoint((this.x1 + this.x2) * 0.5, (this.y1 + this.y2) * 0.5);
    };

    XLineSection.prototype.getPointFromX = function(x)
    {
        let point = this.getLine().getPointFromX(x);
        if ((point != null) && this.getBoundingRect().containsPoint(p))
        {
            return point;
        }

        return null;
    };

    XLineSection.prototype.getPointFromY = function(y)
    {
        let point = this.getLine().getPointFromY(y);
        if ((point != null) && this.getBoundingRect().containsPoint(p))
        {
            return point;
        }

        return null;
    };

    XLineSection.prototype.getHeading = function()
    {
        return xMapUtils.getHeadingXY(this.x1, this.y1, this.x2, this.y2);
    };

    XLineSection.prototype.clip = function(rect)
    {
        let containsP1 = rect.containsXY(this.x1, this.y1);
        let containsP2 = rect.containsXY(this.x2, this.y2);

        if (containsP1 && containsP2)
        {
            return this;
        }

        let ips = [];
        ips.push(rect.getLeftSection().getIntersectionPoint(this));
        ips.push(rect.getRightSection().getIntersectionPoint(this));
        ips.push(rect.getBottomSection().getIntersectionPoint(this));
        ips.push(rect.getTopSection().getIntersectionPoint(this));

        let ip1 = null;
        let ip2 = null;

        for (var i = 0; (ip1 == null) && (i < ips.length); i++)
        {
            ip1 = ips[i];
        }

        for (; (ip2 == null) && (i < ips.length); i++)
        {
            ip2 = ips[i];
        }

        if (containsP1)
        {
            if (!ip1.equalsXY(this.x1, this.y1))
            {
                return new XLineSection(this.x1, this.y1, ip1.x, ip1.y);
            }

            if ((ip2 != null) && (!ip2.equalsXY(this.x1, this.y1)))
            {
                return new XLineSection(this.x1, this.y1, ip2.x, ip2.y);
            }

            return null;
        }

        if (containsP2)
        {
            if (!ip1.equalsXY(this.x2, this.y2))
            {
                return new XLineSection(ip1.x, ip1.y, this.x2, this.y2);
            }

            if ((ip2 != null) && (!ip2.equalsXY(this.x2, this.y2)))
            {
                return new XLineSection(ip2.x, ip2.y, this.x2, this.y2);
            }

            return null;
        }

        if ((ip1 == null) || (ip2 == null) || ip1.equals(ip2))
        {
            return null;
        }

        let section = XLineSection.fromPoints(ip1, ip2);
        if (section.getHeading() == this.getHeading())
        {
            return section;
        }

        return XLineSection.fromPoints(ip2, ip1);
    };

    // -----------------------------------------------------------------------------------------------------------------

    function XDrawParams()
    {
        this.strokeStyle = "#FFFFFF";
        this.lineWidth = 1;
        this.sphereDuplication = xConst.sphereDuplication.ALPHA;
    }

    XDrawParams.prototype.getLogString = function()
    {
        return "XDrawParams(strokeStyle: " + this.strokeStyle + ", lineWidth: " + this.lineWidth + ", sphereDuplication: " + this.sphereDuplication + ")";
    };

    XDrawParams.prototype.setStrokeStyle = function(strokeStyle)
    {
        this.strokeStyle = strokeStyle;

        return this;
    };

    XDrawParams.prototype.setLineWidth = function(lineWidth)
    {
        this.lineWidth = lineWidth;

        return this;
    };

    XDrawParams.prototype.setSphereDuplication = function(sphereDuplication)
    {
        this.sphereDuplication = sphereDuplication;

        return this;
    };

    // -----------------------------------------------------------------------------------------------------------------
}

let script = document.createElement("script");
script.type = "application/javascript";
let globalText = "" + global;
globalText = globalText.substring(globalText.indexOf('{') + 1, globalText.lastIndexOf('}'));
script.textContent = globalText + ";(" + wrapper + ")(\"" + GM_info.script.version + "\");";
document.body.appendChild(script);
document.body.removeChild(script);
