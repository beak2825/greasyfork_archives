// ==UserScript==
// @name         TNT Collection
// @version      1.4.172
// @namespace    tnt.collection
// @author       Ronny Jespersen
// @description  TNT Collection of Ikariam enhancements to enhance the game
// @license      MIT
// @include		 http*s*.ikariam.*/*
// @exclude		 http*support*.ikariam.*/*
// @require	     https://code.jquery.com/jquery-1.12.4.min.js
// @grant GM_addStyle
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/521349/TNT%20Collection.user.js
// @updateURL https://update.greasyfork.org/scripts/521349/TNT%20Collection.meta.js
// ==/UserScript==

// Define constants for URLs
const VERSION_URL = "http://ikariam.rjj-net.dk/scripts/tnt.Collection/version.php";
const UPDATE_URL = "http://ikariam.rjj-net.dk/scripts/tnt.Collection/update.php";
const UPDATE_HQ_URL = "http://lazy.rjj-net.dk/tnt/ikariam/hq/update";


// Used to select all units when pillaging
// function delay(time) {
//     return new Promise(resolve => setTimeout(resolve, time));
// }

var tnt = {

    version: GM_info.script.version,

    url: {
        versionUrl: VERSION_URL,
        updateUrl: UPDATE_URL,
        update: UPDATE_HQ_URL
    },

    console: {
        log: console.log,
        dir: console.dir
    },

    settings: {
        dev: true,
        debug: {
            enable: true,
            level: 5,
            timer: {
                enable: true
            }
        }
    },

    data: {
        test: {},

        ikariam: {
            subDomain: location.toString().split('.')[0].split('//')[1],

            url: {
                notification: {
                    defaultPicture: "https://" + location.toString().split('.')[0].split('//')[1] + ".ikariam.gameforge.com/cdn/all/both/layout/advisors/mayor_premium.png",
                    mayor: "https://" + location.toString().split('.')[0].split('//')[1] + ".ikariam.gameforge.com/cdn/all/both/layout/advisors/mayor.png",
                    mayor_premium: "https://" + location.toString().split('.')[0].split('//')[1] + ".ikariam.gameforge.com/cdn/all/both/layout/advisors/mayor_premium.png",
                    general: "https://" + location.toString().split('.')[0].split('//')[1] + ".ikariam.gameforge.com/cdn/all/both/layout/advisors/general.png",
                    general_premium: "https://" + location.toString().split('.')[0].split('//')[1] + ".ikariam.gameforge.com/cdn/all/both/layout/advisors/general_premium.png",
                    general_alert: "https://" + location.toString().split('.')[0].split('//')[1] + ".ikariam.gameforge.com/cdn/all/both/layout/advisors/general_premium_alert.png",
                    scientist: "https://" + location.toString().split('.')[0].split('//')[1] + ".ikariam.gameforge.com/cdn/all/both/layout/advisors/scientist.png",
                    scientist_premium: "https://" + location.toString().split('.')[0].split('//')[1] + ".ikariam.gameforge.com/cdn/all/both/layout/advisors/scientist_premium.png",
                    diplomat: "https://" + location.toString().split('.')[0].split('//')[1] + ".ikariam.gameforge.com/cdn/all/both/layout/advisors/diplomat.png",
                    diplomat_premium: "https://" + location.toString().split('.')[0].split('//')[1] + ".ikariam.gameforge.com/cdn/all/both/layout/advisors/diplomat_premium.png"
                }
            }
        },

        storage: {
            notification: {
                cities: false,
                military: false,
                militaryAlert: false,
                scientist: false,
                diplomat: false
            },
            ambrosia: 0,
            gold: 0,
            resources: {
                city: {}
            }
        },
    },

    sounds: {
        alertSound: new Audio("data:audio/mp3;base64,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/XQ0F5IZ02SDoNlsXoeUtnOLbFEXPeZyydac5R4ySMgFRpZijAjMEkby8yvS9fsyJVr8bzaHFxIkF0O9NftowAAG2uAwICBf/96y9dX//f////tv7e/+/9W/b9vovRv//r/+1nnrkVMjMzVFIgmgHTwRdQIlAAyUDA5pbQ+V2HSjkOppxxr7OYFZdMwI9A0xjAbYgFQApwAAiFgGTFHBs6HHAs4sYN3CGhlg4GKSBhfQhAwCRMcZoXCkLmUQw2JlEvmlNNkqDmK5eeyLMkhNWWmbIoLdkGRQW7XuzKX+hbbdKr2UdmzXPrUgaVCgAAUC0UAADf//p//Tr////Sn////97//p/2////////uSZEwAA8VDVcViQAIyTXidoIgAW60vPvm9gABsgCODACAA///pbb89r0MikIjvGBqdRZ1ETgQAAAAAAAADhnMGRtyGYweHciRtAUcKNGGGgsPrDm7rAjBAgGLsJPmMhgqFFwVUzGQAyVyMGBDeZAGGJhxAb2jiVQZ8VmDQJEvGpRYFPTERBQUyUOL1DSuCQoaMDHhMlDkdDBwctGXoL5EIit1nLdV2gIcCCYcB1TszTtTe0+DjVmuSFsinTCVUGGs+aekMvGM3PjsPOSzGGX/k8itdaQuloUGu9ZjcFVuxavjjrs1jqzOSiP3pTupUqy6bpN3Zmr//VjjWZuig/v///8thqJz3////0s1dd/pU3/u6f////////+v2f//+XMfA6H/F1pN//hYSf/jzygAAYAAAImCEhz0feHViByqpZUsyg6zqBqru2XRcFL1IlLD5DUjhVONqVDYZyqGAhyqLqBdAIRxJEekhJ0sr1Wq2NBTqGoay0Yk891bf9rWrr+2/mvrX4tv1/9t+sF7aJQVBUGgaiUFn/lg5wad8SgqCo//7kmQ5D/OLLctnYeAAMMAYjeAIAIAAAaQAAAAgAAA0gAAABOt21ttt0CYKwoDQlBUFQVOlQViXxYGj3EQNA0e1A19YK1/EQNf/lf//5Y9wa//+CtVMQU1FMy45OS4zVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU="),
        snd: new Audio("data:audio/mp3;base64,//twxAAAApgBJvQAACQeQig/N0AAMALwgABhhYOBj/9HKO//rP////+poeCChCTJxBRDqeKhViMBG5NphGYEhIOmsib8o0yAygkLQnmx8G9MQBk+Aclq7KI+AMUMBQIBggIBoAcA7CaD5wMkAEIQDgYhOAuEJwiC4NjYGSDAYQMAwIBtmfAzIAAKi50nyJnQMKJAUHiFAMWBEfA1HgYQGBjDIocDDBSfImg5fUAMMChcAAIA0AFJBiQUomOEWcTpXqRNyuzni4OQJ0AyoUScnCJmQhECFgBlzA1RmU99WKmK0HYICCcDMcBiX2QJpRsXlJJa121bJ3pmm6jXj06h9f//y4iXyQHLHGVSLoDjD8AsoAKDixmKCUySTU6yiVADRYNtiS////9NZmb////qUoxV78cARkYopP/7YMQDgA1JjWX9hQAhvzHr/ZS1pK7anGYiDqr1UxQhjpcCoh6idFnGnsvpvWPDT2NTnnDRmU182ANJTTUOuUNH7foYaN/eeQGETZ2rsT+hxEEklNf6Zkz2Kj5SRPup1aexy22dDjTjjTqLrnL72uyf///800WX5TvxyBrekwvel0KqDmNnTlcBF1RIqgtZWKNoSFvp20BJooqyMHJLNz31apKtL3tTLC5P+kZIore11qJYb1JP1spHr1omR6i2s1CANnNlt9FR/frXSb/TWyfqdR7mXfU+UnzrpP6C2Q/1v/1V/1VEfxa85QBIeSwnsbZLoIbvK1MSIB2b5D07Th1QKyxJ0f/7UMQOgA0ZjVXstVKhhyiqPaZBXJVVkle5lWbaK1b1a35iMhFSCeqwDhbbWgjsqq+qCyBEaxraxcIAmyDqgim+cC2wzJP9R831NkZb/Ne39+Rt/qSdP60N/7f9P+rSTlozFEDZ5VC+eLB4mUMHUUEIUEIkdwUEoEA5+wy3wwQYkGK7bY8reosf1rM0fzi0grn9Vq0jJNkT7KSdA2W9/pNzP0S6ztWkaBvJFzUuo2+tFv9aP/1f/R/6iK6Sn/NjDP/+tWqzACZVRBaLgCXt1vP/+1DEBoAMQY9J7Q5u4ZQx6D3GTWR6gOMcDa8HIS9IIcnunIasSf2mhmYpWwTjMrky4NW7JOEkUQFQGro6SKqHdA+ip2QU6/dFuUP/WgTYt5eTb+6SLJdJbOaoW/6//q/9//t/////6RQQSXAAA4ckDkukGyw01RHtOQEgdpAcA08jAA6OIH0ODAVnj6yNw4PwqQN9q2039dPdBjIbY+gPNTJFukgyTVF4wQU11XW//Kf/qUYiok43/Wt1sh7JIt/7P/6bf60P/r/////9ZZZY//tgxACADQmNQe4ybOF4saj9o0mVcQAVR2AFU6IfJ/3VfZkJfZuKAIHAIwOTDg5DDAstVxpaOx29PFPWyqVpSisfXwvboITo9EeBg0RVk+ya12VNi+z2u//zD/pGhKFkNCD6ls67p2XrX71TD2/1f/Rb/Wv/7/////+YlhaogBFiCIXryQapNO2uxIsxARyxIQrCKqzkwGdswguYFnWTCQhOE0k7KrS63nT5cCcsvWt0aLugPE4kpTTJ7+3WTf/UkdHSKRHNL697/+90////7/+r///////siaqKf6AOlIAkX0DpSGgeFRwqFVSWFL+nCpzQMCwdWtAsuh1UdjCzAWMzSWbW//tAxBUADcWPP6xxSelMoym9kbYU8rP4fzf8tXI7TQaCQ52/3VizlEqOMeaWtnI515irURH/YlFULkbhAcvnM1KbqYpIh3/6t/xeII//kxb///////i8oay9YoAewxkP6/MSWQ0kXUsBybaDU7bEKRhRwZBdy6jwypun5tl3oMmzbvf4yMwAdN1qUpJDQaWGxUpO13/9Rv/1OiXxihwIr9v/2////zz+v///5Ko4cwAFVQADK7T/+1DEBIAMuY0/7HJpKWux6H2pHhwbrhBrPFFxhBKMREeIBbDzGRCJzJFZc6hp6unct1cYfnZ1GdRQqRMp08O4BmxXPOtVSFJTnWMzpr5t/+r/zQmj4XPEgWl+vvXdnpG9L///6mf/Ut///////9ayBDUmQABVTIhZLointyNsykyIRRo0BgULXTQYFHX2ma0Aw1utZi3KLqoJTrqqdJzrGoI4KqcxWQ1jLqVQaEjND2t/1/9xxQAR8yj539e5d////7v/0///////9hq1SJQA//tQxAGADA2PQezySKFlHCf9tE2kBDQiFW/UJJbfRkYgEBMIoUYYsfMoI5cCSgMOdRX5NI6RayZdM8i1M1nTI0eg5gtEmAD7Sear0e60kTExVzXX/0P+pNMiozo7092/9mrUr///9aj/+r///////6jyJPIAAESAALp4xU+lk6TIkRQKTB4OGjA3Q4OZLnNZjVKHSwrBJ5mnY/kXIvgxBaBoBwEVJz2q1G6Bgz623QrSbqL//UaD7MR7FvP7etL1+eM2f+G/EP///xRCOHAABP/7UMQCAAt4uT3s8mkhdDGn/bHKFFUQBq+iKWo0tORDMAILzLsKwGbyd9KwYM2aT9hr8C09rTl2N2OV6bVnVI3PMkiOcBxes0fU+10CYL5dU7Vn222fzD/0yiVByCefpStmlNzf+T8h///8RkjihAANkMAf3xijxh5yS2xig20oMFQUImFLJ+EEDhlp0ZpodtYxK67NokopEkp1O2kbD7AhCdf/UiYFg0tu3s3yZ/8wIwWoRoQw9/V31d1K////Tf/V///////9zqYngAADRhD/+1DEAwAKdRk97HInIXexp72eQSQNa+YwzfxnZaQ1xawDriwSCxqOAKsFAxy6SvGJ+pU6+GjVCaKWa1v1prUdKABHQN1aq/lpAzf//6v/WZFIvv/7t69tD///5ih6P///oNlDEAAbIAC+fkFnTZVHFOyqIVAwKkhsbMB5khiRGWa/Uth6cv7qP/YsayxslW60c+6SSAB8Txotalb9ycmDIVdrdT6k//SWUhYTdP7X2X6qm9X//+tv9bf///////MaBYAAAzIQFOdIP+RvILA8//tQxAeADMGPN+4abuFnsWe9njUlWHjUx4mGKAOYMYJmipCgPUOcGGoBpps7BLQqKas5ffPSZ2RYUKAew6aJZYQSoWMTU+n/2WpjI9SMEGT/1oniSJx/1Wrf1VL+j//+p2/1///////+ozOLN4AAATUmJ6vsLW30YGDBDDhXgAQVRmZ0eMNIsNF7xS3OdwqZzH0kpq39KdNlpUj2cNQEmimtBzjJU3Y6kcLje3+2pf/1GBKDw//uhv////7/+r///////zMfNnAAAYMoDteAP//7UMQFAAqUvT3uPU1hXDGnvbYpdClsNLlBoCaSHAoDBowqYDqKjAQqVy/UZZq7b08XpKb3bVJYvlfzX+5r5kbgYES2O2mo3MH9P/20Mr/yAWgK4EJb0dR6z//////xITwAAKsxo298AcwdtiBacxAQZ2EDgsMhWBP/vAEFgAEM4E0qGZPdC1nnOvkSqdf+Z2Gm28DLrupU3GexeSf/1ZqLb/qVDMY/r/7p7a/////////////YsieQAAJnRiaTgD9wE1UqAwqDFjSDJb0w4Lz/+0DEDIAK2Y097j1LoT8XZ722NWT1AwEiKI0jVU6d6hZMC01GuN4T23zanrH+dNYzolflTcyyDrl79//0/+VJAMK/6/2RF/T////////////+XJ6AAA4YyHdeAM+vk24kMBy2+RERgYiAsAZbqiECAqSko9O2oghmPkH3inWt13besyRBQFjvrX9R9Ro3//qR/9bCyC+Ek7uncmAP//////k6XwADthG9vAGWnTWgmmFilgzAAf/7UMQJgAqguTus8ilhgRcmdZ7Q3Kwadp784CRHW5C5yB7FPT6fXdzGtzV2K60611JutAgQF6QV7JsV03z5w+Yl9C9X/9D/5gbC3kKY+dFdtf//////FBMAAFABP7QBhjLoZSGMItOY4hTDIFTDgzTi5MDDoES3yxXelsuxUiR01OmSdjbNrUlrUVSTBFPGUPajxut9RxJRozLpIqsvrTW8ze39ReGNImKOY25ePKE2v//////4omoFgAABZSIf9oAx6/jOzBAIMRiVQADEMIH/+1DEDAALnLs17iZNIdAx5SntKXyRgJYHdpCYWBCx4YlZARqBgnJzM24ytZml3+vUGnB/CDiRa6Bk19lmhmW1K02dVegp2agn7fMyYHOGE3FE7v//////6jZoAWATwoAZ3HxaM1UsAAEADIBAwMDsCgwiQyDUXCbMJ0AYHNQwMr1vopPzdyU9yz+9+8vksP73+pzOpKxUAdwaLGYXhUrySerZbwzgsFBgmjkeOyqUoa1DTppt1P/mjIGBO/9fddbV/////////////yIdLw2A//tgxAEADIWPK67RUqF9lyV1rs0cAvkAPGkBa5A7yL3GgARLJioMVgZMFl1MZogMDArEIDJotycGPTLQ3MVSyv1eR+s1j+Sb62YyHyI+Co4QoaPs/yomlXORc1zDW+bp/6sIMFRZ/p/p6f//+31f////////8oYFgADrAF6mALG4g+4MIGFbiIYZsuIwJ0JB+QeoYaAkC6tDfvJPyx0JXRyFJ3ZZoOdGuPT51aluEhgZ6BiU0Wmxs3sWVGtdNSbqSS3dXrW6n/yNICe75+P1o//////8SuUGgAK2ET1gAWe42mIgoBJemJwMY3ChjN5H9ZyYrCheFYzkhUc2ZVArHNr2lMt4//tAxBcADHmNLa4yjSGfsaX1wrcUgkb9nY6BKhogCpQFgBE0DAzMHZVbEaV6Oqp0VJWVVTW2/q9R4UYt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")
    },

    images: {},

    core: {

        init: function () {
            tnt.core.debug.log("TNT Collection v" + tnt.version + " - Init...");

            // Init Storage as the first thing
            tnt.core.storage.init();

            // Resource
            tnt.resource.update();
            tnt.resource.events();

            // Notification
            tnt.core.notification.init();

            // Events
            tnt.core.events.init();

            // Options
            tnt.core.options.init();

            // Version check // TODO: JSON don't work
            // tnt.checkVersion();

            // Info box // TODO: Not Used
            // tnt.core.info.init();

            // Do ALL the items that needs to be done on every page
            tnt.all();

            // Do the items regarding the current page
            switch ($("body").attr("id")) {
                case "island": tnt.island(); break;
                case "city": tnt.city(); break;
                case "worldmap_iso": tnt.world(); break;
            }

            // TODO Don't work. Try to append script tag witht the code and see if that will work
            // tnt.alrtSound.play();
        },

        ajax: {
            send: function (data, url = tnt.url.update, callback = null) {
                tnt.core.debug.log('Data length: ' + JSON.stringify(data).length, 3);
                GM_xmlhttpRequest({
                    url: url,
                    method: 'POST',
                    data: "data=" + encodeURIComponent(JSON.stringify(data)),
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    onload: function (response) {
                        tnt.core.debug.dir(response.responseText, 5);
                        if (callback) {
                            callback();
                        }
                    }
                });
            }
        },

        debug: {

            log: function (value, level = 1) {
                if (tnt.settings.debug.enable && tnt.settings.debug.level > level) { tnt.console.log(value); }
            },

            dir: function (value, level = 1) {
                if (tnt.settings.debug.enable && tnt.settings.debug.level > level) { tnt.console.dir(value); }
            },

            timer: {

                start: function (label) {
                    if (tnt.settings.debug.timerenable && tnt.settings.debug.enable) { console.time(label); }
                },

                end: function (label) {
                    if (tnt.settings.debug.timerenable && tnt.settings.debug.enable) { console.timeEnd(label); }
                }
            }
        },

        utils: {
            index: function (obj, path, value = undefined) {
                if (typeof path === 'string') {
                    return tnt.core.utils.index(obj, path.split('.'), value);
                }

                if (path.length === 1) {
                    return value !== undefined ? (obj[path[0]] = value) : obj[path[0]];
                }

                return tnt.core.utils.index(obj[path[0]], path.slice(1), value);
            },
            index2: function (obj, is, value) {
                if (typeof is == 'string') {
                    return tnt.core.utils.index(obj, is.split('.'), value);
                } else if (is.length == 1 && value !== undefined) {
                    return obj[is[0]] = value;
                } else if (is.length == 0) {
                    return obj;
                } else {
                    return tnt.core.utils.index(obj[is[0]], is.slice(1), value);
                }
            },

            delay: function (time) {
                return new Promise(resolve => setTimeout(resolve, time));
            },

            getGradientColor: function (value1, value2, color1, color2) {
                // Defaults colors if not set
                color1 = color1 || "#ff0000";
                color2 = color2 || "#00FF00";

                // Ensure value1 is not greater than value2
                if (value1 > value2) {
                    [value1, value2] = [value2, value1];
                }

                // Convert hex colors to RGB
                function hexToRgb(hex) {
                    const bigint = parseInt(hex.substring(1), 16);
                    return {
                        r: (bigint >> 16) & 255,
                        g: (bigint >> 8) & 255,
                        b: bigint & 255
                    };
                }

                // Convert RGB back to hex
                function rgbToHex(r, g, b) {
                    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
                }

                const color1Rgb = hexToRgb(color1);
                const color2Rgb = hexToRgb(color2);
                const ratio = value1 / value2;
                const r = Math.round(color1Rgb.r * ratio + color2Rgb.r * (1 - ratio));
                const g = Math.round(color1Rgb.g * ratio + color2Rgb.g * (1 - ratio));
                const b = Math.round(color1Rgb.b * ratio + color2Rgb.b * (1 - ratio));

                return rgbToHex(r, g, b);
            },

                        getHighestValue: function (key, obj) {
                            let highest = Number.NEGATIVE_INFINITY;

                            for (let city in obj) {
                                if (obj[city][key] > highest) {
                                    highest = obj[city][key];
                                }
                            }

                            return highest;
                        }

        },

        storage: {

            init: function () {
                // Merge storage
                tnt.data.storage = $.extend(true, {}, tnt.data.storage, JSON.parse(localStorage.getItem("tnt_storage")));
                var ikaTweaks = JSON.parse(localStorage.getItem("ikaTweaks_"));
                tnt.data.ikaTweaks = ikaTweaks ? ikaTweaks : {};
                //console.dir(tnt.data.ikaTweaks);
            },

            get: function (group, name) {
                return tnt.data.storage[group][name];
            },

            set: function (group, name, value) {
                tnt.data.storage[group][name] = value;
                tnt.core.storage.save();
            },

            save: function () {
                localStorage.setItem("tnt_storage", JSON.stringify(tnt.data.storage));
            }
        },

        notification: {
            init: function () {
                if (Notification && Notification.permission !== "granted") {
                    Notification.requestPermission();
                }
            },

            notifyMe: function (title, message, picture) {
return;
                // Play sound ?
                if (GM_getValue("notificationSound", true)) {
                    tnt.core.debug.log('Play sound!', 5);
                    // tnt.sounds.snd.play();
                }

                // Do we have Notification
                if (!Notification) {
                    // TODO something to show in tntInfo when that is up  and running
                    alert("This browser don't support desktop notifications. Update to a modern browser or disable the notifications.");
                    return;
                }

                picture = picture ? picture : tnt.settings.notification.defaultPicture;

                // ask for permission to speak
                if (Notification.permission !== "granted") {
                    Notification.requestPermission();
                } else {
                    var notification = new Notification(title, {
                        // notification icon, should be replaced with the correct advisor later
                        icon: picture,
                        body: message,
                    });
                    // kill notifications 700 ms after their birth
                    setTimeout(function () { notification.close(); }, 7000);
                    // if user shows affection for notify, let notify do them a last service before it dies prematurely.
                    notification.onclick = function () {
                        window.open("http://" + tnt.data.ikariam.subDomain + ".ikariam.gameforge.com/index.php");
                    }

                    tnt.core.debug.log("Notification send: " + title, 3);
                }
            },

            check: function () {
                // cities advisor
                if (!tnt.core.storage.get('notification', 'cities')) {
                    var normal = $('li#advCities a.normalactive');
                    var premium = $('li#advCities a.premiumactive');
                    var el, img;
                    if (normal) {
                        el = normal;
                        img = normal.css("background-image");
                    } else if (premium) {
                        el = premium;
                        img = premium.css("background-image");
                    }
                    console.dir(el);
                    console.dir("img: " + img);

                    if (el && $(el).data("notification") !== true); {
                        tnt.core.notification.notifyMe(
                            "Ikariam",
                            "Something happened in one of your towns!",
                            tnt.data.ikariam.url.notification.mayor_premium
                        );
                        $(el).data("notification", true);
                    }

                    tnt.core.storage.set('notification', 'cities', true);
                } else {
                    tnt.core.storage.set('notification', 'cities', false);
                }

                // diplomacy advisor
                if ($('#js_GlobalMenu_diplomacy').is(".normalactive, .premiumactive") && !tnt.core.storage.get('notification', 'diplomat')) {
                    tnt.core.notification.notifyMe(
                        "Ikariam",
                        "Someone sent you a message!",
                        tnt.data.ikariam.url.notification.diplomat_premium
                    );
                    tnt.core.storage.set('notification', 'diplomat', true);
                } else {
                    tnt.core.storage.set('notification', 'diplomat', false);
                }

                // military advisor
                if ($('#js_GlobalMenu_military').is(".normalactive, .premiumactive") && !tnt.core.storage.get('notification', 'military')) {

                    console.dir("military", $('li#advMilitary a'));

                    tnt.core.notification.notifyMe(
                        "Ikariam",
                        "Your military advisor is trying to tell you something!",
                        tnt.data.ikariam.url.notification.general_premium
                    );
                    tnt.core.storage.set('notification', 'military', true);
                } else {
                    tnt.core.storage.set('notification', 'military', false);
                }
                // military alerts
                if ($('#js_GlobalMenu_military').is(".normalalert, .premiumalert") && !tnt.core.storage.get('notification', 'militaryAlert')) {
                    tnt.core.notification.notifyMe(
                        "Ikariam",
                        "One of your towns is being attacked!",
                        tnt.data.ikariam.url.notification.general_premium
                    );
                    tnt.core.storage.set('notification', 'militaryAlert', true);
                } else {
                    tnt.core.storage.set('notification', 'militaryAlert', false);
                }

                // scientist advisor
                if ($('#js_GlobalMenu_research').is(".normalactive, .premiumactive") && !tnt.core.storage.get('notification', 'scientist')) {
                    tnt.core.notification.notifyMe(
                        "Ikariam",
                        "New research available!",
                        tnt.data.ikariam.url.notification.scientist_premium
                    );
                    tnt.core.storage.set('notification', 'scientist', true);
                } else {
                    tnt.core.storage.set('notification', 'scientist', false);
                }
            }
        },

        events: {

            init: function () {
                tnt.core.events.ikariam.override();
            },

            ikariam: {

                override: function () {

                    // updateGlobalData
                    ajax.Responder.tntUpdateGlobalData = ajax.Responder.updateGlobalData;
                    ajax.Responder.updateGlobalData = function (response) {
                        var view = $('body').attr('id');
                        tnt.core.debug.log("updateGlobalData (View: " + view + ")", 3);

                        // Let Ikariam do its stuff
                        ajax.Responder.tntUpdateGlobalData(response);

                        // Check notifications
                        tnt.core.notification.check();

                        // Collect resource data
                        tnt.resource.update();
                    }

                    // updateBackgroundData
                    ajax.Responder.tntUpdateBackgroundData = ajax.Responder.updateBackgroundData;
                    ajax.Responder.updateBackgroundData = function (response) {
                        var view = $('body').attr('id');
                        tnt.core.debug.log("updateBackgroundData (View: " + view + ")", 3);

                        // Let Ikariam do its stuff
                        ajax.Responder.tntUpdateBackgroundData(response);

                        // Check notifications
                        tnt.core.notification.check();

                        switch (view) {
                            case "worldmap_iso":
                                tnt.core.debug.log($('worldmap_iso: div.islandTile div.cities'), 3);
                                var totalCities = 0;
                                $('div.islandTile div.cities').each(function () {
                                    totalCities += parseInt($(this).text());
                                });
                                tnt.core.debug.log(totalCities, 3);
                                break
                            case "city":
                                break;
                            case "plunder":
                                // Select all units when pillaging
                                tnt.core.utils.delay(1000).then(() => $('#selectArmy .assignUnits .setMax').trigger("click"));
                                break;
                            case 'tradeAdvisor':
                                tnt.core.debug.log("tradeAdvisor", 3);
                                break;
                        }
                    }

                    // changeView
                    ajax.Responder.tntChangeView = ajax.Responder.changeView;
                    ajax.Responder.changeView = function (response) {
                        var view = $('body').attr('id');
                        tnt.core.debug.log("changeView (View: " + view + ")", 3);

                        // Let Ikariam do its stuff
                        ajax.Responder.tntChangeView(response);

                        // Check notifications
                        tnt.core.notification.check();

                        tnt.core.debug.log("ikariam.templateView.id: '" + ikariam.templateView.id + "'", 3);
                        switch (ikariam.templateView.id) {
                            case "townHall":
                                if (!ikariam.backgroundView.screen.data.isCapital && $('#sidebarWidget .indicator').length > 1) {
                                    $('#sidebarWidget .indicator').last().trigger("click");
                                }
                                // tnt.
                                break;
                            // TODO one of the contentBox01h dosn't work with the Embassy -> Allians dialog
                            case "tradeAdvisor":
                                $("#tradeAdvisor").children('div.contentBox01h').eq(1).hide(); // Seen in tradeAdvisor
                                break;
                            case "militaryAdvisor":
                                $("#militaryAdvisor").find('div.contentBox01h').eq(0).hide(); // Seen in researchAdvisor
                                break;
                            case "researchAdvisor":
                                $("#researchAdvisor").find('div.contentBox01h').eq(1).hide(); // Seen in researchAdvisor
                                break;
                            case "diplomacyAdvisor":
                                $("#tab_diplomacyAdvisor").find('div.contentBox01h').eq(2).hide(); // Seen in diplomacyAdvisor
                                break;
                            case "transport":
                                // Remove Trition engine on transport dialog
                                $('#setPremiumJetPropulsion').hide().prev().hide();
                                break;
                            case "resource":
                                $('#sidebarWidget .indicator').eq(1).trigger("click");
                                break;
                            case "merchantNavy":
                                // Show cargo content on the ship transport view
                                setTimeout(function () {
                                    pulldownAll();
                                }, 500);
                                break;
                            case "deployment":
                            case "plunder":
                                // Select all units when moving army
                                tnt.core.utils.delay(1000).then(() => $('#selectArmy .assignUnits .setMax').trigger("click"));
                                break;
                        }
                    }
                }
            }
        },

        options: {

            init: function () {

                if (GM_getValue("version") != tnt.version) { tnt.core.options.setup(); }

                /* Add option link, option box and eventlisteners */
                // $("#GF_toolbar ul").append('\
                $('\
                    <li>\
                        <a id="tntOptionsLink" href="javascript:void(0);">TNT Options v' + tnt.version + '</a>\
                        <div id="tntOptions" class="tntBox" style="display:none;">\
                            <div id="tntUpdateLine" align="center" style="padding-bottom:5px;">\
                                <a id="tntColUpgradeLink" href="" style="display:none;color:blue;font-size:12px;">Version <span id="tntColVersion"></span> is available. Click here to update now!</a>\
                            </div>\
                            <div>\
                                <div class="tnt_left" style="float:left;width:50%;">\
                                    <legend>All:</legend>\
                                    <input id="tntAllRemovePremiumOffers" type="checkbox"' + (GM_getValue("allRemovePremiumOffers") ? ' checked="checked"' : '') + ' /> Remove Premium Offers<br/>\
                                    <input id="tntAllRemoveFooterNavigation" type="checkbox"' + (GM_getValue("allRemoveFooterNavigation") ? ' checked="checked"' : '') + ' /> Remove footer navigation<br/>\
                                    <input id="tntAllChangeNavigationCoord" type="checkbox"' + (GM_getValue("allChangeNavigationCoord") ? ' checked="checked"' : '') + ' /> Make footer navigation coord input a number<br/>\
                                </div>\
                                <div class="tnt_left" style="float:left;width:50%;">\
                                    <legend>Notifications:</legend>\
                                    <input id="tntNotificationAdvisors" type="checkbox"' + (GM_getValue("notificationAdvisors") ? ' checked="checked"' : '') + ' /> Show notifications from Advisors<br/>\
                                    <input id="tntNotificationSound" type="checkbox"' + (GM_getValue("notificationSound") ? ' checked="checked"' : '') + ' /> Play sound with notifications from Advisors<br/>\
                                </div>\
                                <div class="tnt_left" style="float:left;width:50%;">\
                                    <legend>Islands:</legend>\
                                    <input id="tntIslandShowCityLvl" type="checkbox"' + (GM_getValue("islandShowCityLvl") ? ' checked="checked"' : '') + ' /> Show Town Levels on Islands<br/>\
                                </div>\
                                <div class="tnt_left" style="float:left;width:50%;">\
                                    <legend>City:</legend>\
                                    <input id="tntCityRemoveFlyingShop" type="checkbox"' + (GM_getValue("cityRemoveFlyingShop") ? ' checked="checked"' : '') + ' /> Remove flying shop<br/>\
                                    <input id="tntCityShowResources" type="checkbox"' + (GM_getValue("cityShowResources") ? ' checked="checked"' : '') + ' /> Show resources<br/>\
                                    <div class="tnt_left" style="padding-left:20px;">\
                                        <input id="tntCityShowResourcesPorpulation" type="checkbox"' + (GM_getValue("cityShowResourcesPorpulation") ? ' checked="checked"' : '') + ' /> Show porpulation<br/>\
                                        <input id="tntCityShowResourcesCitizens" type="checkbox"' + (GM_getValue("cityShowResourcesCitizens") ? ' checked="checked"' : '') + ' /> Show citizens<br/>\
                                        <input id="tntCityShowResourcesWoods" type="checkbox"' + (GM_getValue("cityShowResourcesWoods") ? ' checked="checked"' : '') + ' /> Show wood<br/>\
                                        <input id="tntCityShowResourcesWine" type="checkbox"' + (GM_getValue("cityShowResourcesWine") ? ' checked="checked"' : '') + ' /> Show Wine<br/>\
                                        <input id="tntCityShowResourcesMarble" type="checkbox"' + (GM_getValue("cityShowResourcesMarble") ? ' checked="checked"' : '') + ' /> Show Marble<br/>\
                                        <input id="tntCityShowResourcesCrystal" type="checkbox"' + (GM_getValue("cityShowResourcesCrystal") ? ' checked="checked"' : '') + ' /> Show Crystal<br/>\
                                        <input id="tntCityShowResourcesSulfur" type="checkbox"' + (GM_getValue("cityShowResourcesSulfur") ? ' checked="checked"' : '') + ' /> Show Sulfur<br/>\
                                    </div>\
                                </div>\
                                <div class="tnt_left" style="float:left;width:50%;">\
                                    <legend>World Map:</legend>\
                                </div>\
                            </div>\
                            <div align="center" style="clear:both;">\
                                <input id="tntOptionsClose" type="button" class="button" value="Close and refresh" />\
                            </div>\
                        </div>\
                    </li>\
                ').insertBefore('li.serverTime'); //.attr('style', 'width:1200px;');

                // Open close option dialog
                $("#tntOptionsLink").bind("click", function () {
                    $("#tntOptions").slideToggle();
                });
                $("#tntOptionsClose").bind("click", function () {
                    $("#tntOptions").slideToggle();
                    location.reload();
                });

                // Option checkboxes bind change event
                $("#tntAllRemovePremiumOffers").bind("change", function () {
                    GM_setValue("allRemovePremiumOffers", (GM_getValue("allRemovePremiumOffers") ? false : true));
                });
                $("#tntAllRemoveFooterNavigation").bind("change", function () {
                    GM_setValue("allRemoveFooterNavigation", (GM_getValue("allRemoveFooterNavigation") ? false : true));
                });
                $("#tntAllChangeNavigationCoord").bind("change", function () {
                    GM_setValue("allChangeNavigationCoord", (GM_getValue("allChangeNavigationCoord") ? false : true));
                });
                $("#tntIslandShowCityLvl").bind("change", function () {
                    GM_setValue("islandShowCityLvl", (GM_getValue("islandShowCityLvl") ? false : true));
                });
                // City options
                $("#tntCityRemoveFlyingShop").bind("change", function () {
                    GM_setValue("cityRemoveFlyingShop", (GM_getValue("cityRemoveFlyingShop") ? false : true));
                });
                // Resources
                $("#tntCityShowResources").bind("change", function () {
                    GM_setValue("cityShowResources", (GM_getValue("cityShowResources") ? false : true));
                });
                $("#tntCityShowResourcesPorpulation").bind("change", function () {
                    GM_setValue("cityShowResourcesPorpulation", (GM_getValue("cityShowResourcesPorpulation") ? false : true));
                });
                $("#tntCityShowResourcesCitizens").bind("change", function () {
                    GM_setValue("cityShowResourcesCitizens", (GM_getValue("cityShowResourcesCitizens") ? false : true));
                });
                $("#tntCityShowResourcesWoods").bind("change", function () {
                    GM_setValue("cityShowResourcesWoods", (GM_getValue("cityShowResourcesWoods") ? false : true));
                });
                $("#tntCityShowResourcesWine").bind("change", function () {
                    GM_setValue("cityShowResourcesWine", (GM_getValue("cityShowResourcesWine") ? false : true));
                });
                $("#tntCityShowResourcesMarble").bind("change", function () {
                    GM_setValue("cityShowResourcesMarble", (GM_getValue("cityShowResourcesMarble") ? false : true));
                });
                $("#tntCityShowResourcesCrystal").bind("change", function () {
                    GM_setValue("cityShowResourcesCrystal", (GM_getValue("cityShowResourcesCrystal") ? false : true));
                });
                $("#tntCityShowResourcesSulfur").bind("change", function () {
                    GM_setValue("cityShowResourcesSulfur", (GM_getValue("cityShowResourcesSulfur") ? false : true));
                });

                // Notification Advisor
                $("#tntNotificationAdvisors").bind("change", function () {
                    GM_setValue("notificationAdvisors", (GM_getValue("notificationAdvisors") ? false : true));
                });
                // Notification Sound
                $("#tntNotificationSound").bind("change", function () {
                    GM_setValue("notificationSound", !GM_getValue("notificationSound"));
                });
            },

            setup: function () {
                /* Set/Upgrade default values */
                GM_setValue("allRemovePremiumOffers", GM_getValue("allRemovePremiumOffers", true));
                GM_setValue("allRemoveFooterNavigation", GM_getValue("allRemoveFooterNavigation", true));
                GM_setValue("allChangeNavigationCoord", GM_getValue("allChangeNavigationCoord", true));
                GM_setValue("islandShowCityLvl", GM_getValue("islandShowCityLvl", true));
                GM_setValue("cityRemoveFlyingShop", GM_getValue("cityRemoveFlyingShop", true));
                GM_setValue("cityShowResources", GM_getValue("cityShowResources", true));
                GM_setValue("notificationAdvisors", GM_getValue("notificationAdvisors", true));
                GM_setValue("notificationSound", GM_getValue("notificationSound", true));
                GM_setValue("version", tnt.version);
            }
        },

        info: {
            // TODO: Not used!
            init: function () {
                $('body').append('\
                    <ul id="tntInfoWidget">\
                        <li class="accordionItem">\
                            <a class="accordionTitle active">TNT Info<span class="indicator"></span></a>\
                            <div class="scroll_area scroll_disabled">\
                                <div class="scroll_arrow_top"></div>\
                                <div class="scroller" style="width: 5px; top: 0px; left: 0px;"></div>\
                                <div class="scroll_arrow_bottom"></div>\
                            </div>\
                            <div class="accordionContent" style="height:400px;">\
                                Player ID: <span id="playerId"></span>\
                            </div>\
                        </li>\
                    </ul>\
                ');
            }
        },

        checkVersion: function () {
            GM_xmlhttpRequest({
                url: tnt.url.version,
                method: 'POST',
                data: JSON.stringify({ "currentVersion": tnt.version }),
                headers: { "Content-Type": "application/json" },
                onload: function (response) { // TODO make this check work again. Response from server not correct
                    if (response.version != tnt.version) {
                        $("#tntOptionsLink").css("color", "darkred");
                        $("#tntColVersion").html(response.responseText.split("&")[0].split("=")[1]);
                        $("#tntColUpgradeLink").attr("href", response.responseText.split("&")[1].split("=")[1]).show();
                    }
                }
            });
        }
    },

    all: function () {
        // Remove premium offers
        if (GM_getValue("allRemovePremiumOffers")) {
            tnt.core.debug.log("Adding allRemovePremiumOffers styles...", 5);
            GM_addStyle("\
                #premium_btn,\
                .premiumOfferBox,\
                .premiumOffer,\
                .expandable.resourceShop,\
                .expandable.slot1,\
                #transport .premiumTransporters, #transport .buildingDescription\
                {\
                    display:none!important;\
                    height:0!important;\
                }\
                #resource #setWorkers .content,\
                #tradegood #setWorkers .content\
                {min-height:180px;}\
            ");

            // Need to be done after loading event of dialogs to be finished
            $("form#ambrosiaDonateForm").closest('li').hide();
        }

        if (GM_getValue("allRemoveFooterNavigation")) {
            $('#footer').hide();
        }
    },

    island: function () {
        // Show level for cities on Island
        if (GM_getValue("islandShowCityLvl")) {
            tnt.core.debug.log("Show level for cities on island view", 5);
            $(".cityLocation").each(function () {
                // Extract the level number using a regular expression
                var classList = $(this).attr('class');
                var levelMatch = classList.match(/level(\d+)/);
                if (levelMatch) {
                    var levelNumber = levelMatch[1];
                    // Append the level number to the corresponding element
                    $("#" + this.id + " > a").append('<span class="tntLvl" style="top:35px; left:25px;">' + levelNumber + '</span>');
                }
            });
        }
    },

    city: function () {
        // Remove Flying Shop
        if (GM_getValue("cityRemoveFlyingShop")) {
            tnt.core.debug.log("Remove flying shop on city view", 5);
            GM_addStyle("#cityFlyingShopContainer{display:none;};");
        }
    },

    world: function () { },

    resource: {
        events: function () {
            $('#tnt_info_resources .tnt_back').on('click', function () { tnt.resource.toggle(this) });
        },

        update: function () {
            tnt.data.storage.resources.city[tnt.get.cityId()] = {
                cityIslandCoords: tnt.get.cityIslandCoords(),
                producedTradegood: parseInt(tnt.get.producedTradegood()),
                population: tnt.get.population(),
                citizens: tnt.get.citizens(),
                max: ikariam.model.maxResources.resource,
                wood: tnt.get.resources.wood(),
                wine: tnt.get.resources.wine(),
                marble: tnt.get.resources.marble(),
                crystal: tnt.get.resources.crystal(),
                sulfur: tnt.get.resources.sulfur(),
                hasConstruction: $("body").attr("id") == "city" ? tnt.has.construction() : tnt.data.storage.resources.city[tnt.get.cityId()].hasConstruction,
                tradegoodProduction: tnt.get.tradegoodProduction(),
            };
            if (tnt.get.cityLvl().length) {
                tnt.data.storage.resources.city[tnt.get.cityId()].cityLvl = tnt.get.cityLvl();
            } else if ($("body").attr("id") == "city" && tnt.data.storage.resources.city[tnt.get.cityId()].hasConstruction) {
                tnt.data.storage.resources.city[tnt.get.cityId()].cityLvl = $('#js_CityPosition0Link').attr('title').replace(/[^\d-]+/g, "");
            } else {
                tnt.data.storage.resources.city[tnt.get.cityId()].cityLvl = tnt.data.storage.resources.city[tnt.get.cityId()].cityLvl;
            };

            var total = {
                population: 0,
                citizens: 0,
                wood: 0,
                wine: 0,
                marble: 0,
                crystal: 0,
                sulfur: 0,
            };

            // Calculate the total resources
            $.each(tnt.data.storage.resources.city, function (index, value) {
                total.population += value.population;
                total.citizens += value.citizens;
                total.wood += value.wood;
                total.wine += value.wine;
                total.marble += value.marble;
                total.crystal += value.crystal;
                total.sulfur += value.sulfur;
            });

            tnt.data.storage.resources.total = total;

            // Save storage
            tnt.core.storage.save();

            // Update template
            tnt.resource.show();
        },

        show: function () {
            if (GM_getValue("cityShowResources") && $("body").attr("id") == "city") {
                // Insert table div if not exists
                if ($('#tnt_info_resources').length === 0) {
                    $('body').append(tnt.template.resources);
                }

                // Make table and add it to div
                var table = '<table id="tnt_resource_table" border="1">\
                    <tr>\
                        <th class="tnt_center tnt_bold">City</th>\
                        <th class="tnt_center tnt_bold">Lvl</th>\
                        <th class="tnt_center"' + (GM_getValue("cityShowResourcesPorpulation") ? '' : ' style="display:none;"') + '>' + tnt.resource.getIcon('population') + '</th>\
                        <th class="tnt_center"' + (GM_getValue("cityShowResourcesCitizens") ? '' : ' style="display:none;"') + '>' + tnt.resource.getIcon('citizens') + '</th>\
                        <th class="tnt_center"' + (GM_getValue("cityShowResourcesWoods") ? '' : ' style="display:none;"') + '>' + tnt.resource.getIcon(0) + '</th>\
                        <th class="tnt_center"' + (GM_getValue("cityShowResourcesWine") ? '' : ' style="display:none;"') + '>' + tnt.resource.getIcon(1) + '</th>\
                        <th class="tnt_center"' + (GM_getValue("cityShowResourcesMarble") ? '' : ' style="display:none;"') + '>' + tnt.resource.getIcon(2) + '</th>\
                        <th class="tnt_center"' + (GM_getValue("cityShowResourcesCrystal") ? '' : ' style="display:none;"') + '>' + tnt.resource.getIcon(3) + '</th>\
                        <th class="tnt_center"' + (GM_getValue("cityShowResourcesSulfur") ? '' : ' style="display:none;"') + '>' + tnt.resource.getIcon(4) + '</th>\
                    </tr>';

                // Add city rows
                $.each(tnt.resource.sortCities(), function (index,cityID) {
                    var value = tnt.data.storage.resources.city[cityID];
                    table += '<tr' + (cityID == tnt.get.cityId() ? ' class="tnt_selected"' : '') + '>\
                        <td class="tnt_city tnt_left' + (value.hasConstruction ? ' tnt_construction' : '') + '" title="' + value.cityIslandCoords + '">\
                            <a onclick="$(\'#dropDown_js_citySelectContainer li[selectValue=\"" + cityID + "\"]\').trigger(\'click\'); return false;">' + tnt.resource.getIcon(value.producedTradegood) + ' ' + tnt.get.cityName(cityID) + '</a>\
                        </td>\
                        <td>' + (value.cityLvl ? value.cityLvl : '-') + '</td>\
                        <td class="tnt_population"' + (GM_getValue("cityShowResourcesPorpulation") ? '' : ' style="display:none;"') + '>' + parseInt(Math.round(value.population)).toLocaleString() + '</td>\
                        <td class="tnt_citizens"' + (GM_getValue("cityShowResourcesCitizens") ? '' : ' style="display:none;"') + '>' + parseInt(Math.round(value.citizens)).toLocaleString() + '</td>\
                        <td class="tnt_wood' + tnt.resource.checkMinMax(value, 0) + (value.producedTradegood == 0 ? ' tnt_bold' : '') + '"' + (GM_getValue("cityShowResourcesWoods") ? '' : ' style="display:none;"') + '><span title="' +cityID+ '">' + value.wood.toLocaleString() + '</span></td>\
                        <td class="tnt_wine' + tnt.resource.checkMinMax(value, 1) + (value.producedTradegood == 1 ? ' tnt_bold' : '') + '"' + (GM_getValue("cityShowResourcesWine") ? '' : ' style="display:none;"') + '><span title="Test">' + value.wine.toLocaleString() + '</span></td>\
                        <td class="tnt_marble' + tnt.resource.checkMinMax(value, 2) + (value.producedTradegood == 2 ? ' tnt_bold' : '') + '"' + (GM_getValue("cityShowResourcesMarble") ? '' : ' style="display:none;"') + '><span title="Test">' + value.marble.toLocaleString() + '</span></td>\
                        <td class="tnt_crystal' + tnt.resource.checkMinMax(value, 3) + (value.producedTradegood == 3 ? ' tnt_bold' : '') + '"' + (GM_getValue("cityShowResourcesCrystal") ? '' : ' style="display:none;"') + '><span title="Test">' + value.crystal.toLocaleString() + '</span></td>\
                        <td class="tnt_sulfur' + tnt.resource.checkMinMax(value, 4) + (value.producedTradegood == 4 ? ' tnt_bold' : '') + '"' + (GM_getValue("cityShowResourcesSulfur") ? '' : ' style="display:none;"') + '><span title="Test">' + value.sulfur.toLocaleString() + '</span></td>\
                    </tr>';
                });

                // Add total row
                var total = tnt.data.storage.resources.total;
                table += '<tr>\
                    <td class="tnt_total">Total</td>\
                    <td></td>\
                    <td class="tnt_population"' + (GM_getValue("cityShowResourcesPorpulation") ? '' : ' style="display:none;"') + '>' + parseInt(total.population).toLocaleString() + '</td>\
                    <td class="tnt_citizens"' + (GM_getValue("cityShowResourcesCitizens") ? '' : ' style="display:none;"') + '>' + parseInt(total.citizens).toLocaleString() + '</td>\
                    <td class="tnt_wood"' + (GM_getValue("cityShowResourcesWoods") ? '' : ' style="display:none;"') + '>' + total.wood.toLocaleString() + '</td>\
                    <td class="tnt_wine"' + (GM_getValue("cityShowResourcesWine") ? '' : ' style="display:none;"') + '>' + total.wine.toLocaleString() + '</td>\
                    <td class="tnt_marble"' + (GM_getValue("cityShowResourcesMarble") ? '' : ' style="display:none;"') + '>' + total.marble.toLocaleString() + '</td>\
                    <td class="tnt_crystal"' + (GM_getValue("cityShowResourcesCrystal") ? '' : ' style="display:none;"') + '>' + total.crystal.toLocaleString() + '</td>\
                    <td class="tnt_sulfur"' + (GM_getValue("cityShowResourcesSulfur") ? '' : ' style="display:none;"') + '>' + total.sulfur.toLocaleString() + '</td>\
                </tr>';

                table += '</table>';

                $('#tnt_info_resources_content').html(table);
            }
        },

        toggle: function (el) {
            if ($(el).hasClass("tnt_back")) {
                $(el).removeClass("tnt_back").addClass("tnt_foreward");
                $('#tnt_info_resources_content').css('width', '25px').css('overflow', 'hidden');
            } else {
                $(el).removeClass("tnt_foreward").addClass("tnt_back");
                $('#tnt_info_resources_content').css('width', 'auto').css('overflow', 'auto');
                tnt.resource.update();
            }
        },

        sortCities: function () {
            var list = {};
            $.each(tnt.data.storage.resources.city, function (cityID, value) {
                list[cityID] = value.producedTradegood;
            });

            // Define the custom order for producedTradegood
            var order = { 2: 0, 1: 1, 3: 2, 4: 3 };

            // Sort list by producedTradegood with custom order
            var sortedList = Object.keys(list).sort(function (a, b) {
                return order[list[a]] - order[list[b]];
            });

            return sortedList;
        },

        checkMinMax: function (city, resource) {
            if (GM_getValue("cityShowResources")) {
                //var city = tnt.data.storage.resources.city[cityID];
                var max = city.max;
                var txt = '';

                switch (resource) {
                    case 0:
                        // Wood
                        if (city.wood > (max*.8)) { txt += ' storage_danger'; }
                        if (city.wood < 100000) { txt += ' storage_min'; }
                        break;
                    case 1:
                        // Wine
                        if (city.wine > (max*.8)) { txt += ' storage_danger'; }
                        if (city.wine < 100000) { txt += ' storage_min'; }
                        break;
                    case 2:
                        // Marble
                        if (city.marble > (max*.8)) { txt += ' storage_danger'; }
                        if (city.marble < 50000) { txt += ' storage_min'; }
                        break;
                    case 3:
                        // Crystal
                        if (city.crystal > (max*.8)) { txt += ' storage_danger'; }
                        if (city.crystal < 50000) { txt += ' storage_min'; }
                        break;
                    case 4:
                        // Sulfur
                        if (city.sulfur > (max*.8)) { txt += ' storage_danger'; }
                        if (city.sulfur < 50000) { txt += ' storage_min'; }
                        break;
                }

                return txt;
            }
        },

        getIcon: function (resource) {
            switch (resource) {
                case 0:
                    return '<img class="tnt_resource_icon" title="Wood" src="/cdn/all/both/resources/icon_wood.png">';
                case 1:
                    return '<img class="tnt_resource_icon" title="Wine" src="/cdn/all/both/resources/icon_wine.png">';
                case 2:
                    return '<img class="tnt_resource_icon" title="Marble" src="/cdn/all/both/resources/icon_marble.png">';
                case 3:
                    return '<img class="tnt_resource_icon" title="Crystal" src="/cdn/all/both/resources/icon_crystal.png">';
                case 4:
                    return '<img class="tnt_resource_icon" title="Sulfur" src="/cdn/all/both/resources/icon_sulfur.png">';
                case 'population':
                    return '<img class="tnt_resource_icon" title="Population" src="//gf3.geo.gfsrv.net/cdn2f/6d077d68d9ae22f9095515f282a112.png" style="width: 10px;">';
                case 'citizens':
                    return '<img class="tnt_resource_icon" title="Citizens" src="/cdn/all/both/resources/icon_population.png">';
            }
        }
    },

    get: {
        playerId: function () { return parseInt(ikariam.model.avatarId); },
        // islandId: function () { return $("#changeCityForm .viewIsland a").attr("href").split("=")[2]; },
        cityId: function () { return ikariam.model.relatedCityData.selectedCity.replace(/[^\d-]+/g, "") },
        cityLvl: function () { return $("#js_CityPosition0Level").text(); },
        cityIslandCoords: function () { return $("#js_islandBreadCoords").text(); },
        cityName: function (id) { return id ? ikariam.model.relatedCityData["city_" + id].name : $("#citySelect option:selected").text().split("] ")[1]; },
        alliance: {
            Id: function () { return parseInt(ikariam.model.avatarAllyId); },
        },
        tradeShips: {
            free: function () { return $("#globalResources .transporters a span:eq(1)").text().split(" ")[0]; },
            // all: function () { return $("#globalResources .transporters a span:eq(1)").text().split(" ")[1].replace(/[^\d-]+/g, ""); }
        },
        ambrosia: function () { return ikariam.model.ambrosia; },
        gold: function () { return parseInt(ikariam.model.gold); },
        godGoldResult: function () { return ikariam.model.godGoldResult; },
        income: function () { return ikariam.model.income; },
        upkeep: function () { return ikariam.model.upkeep; },
        sciencetistsUpkeep: function () { return ikariam.model.sciencetistsUpkeep; },
        hasAlly: function () { return ikariam.model.hasAlly; },

        isOwnCity: function () { return ikariam.model.isOwnCity; },
        maxCapacity: function () { return ikariam.model.maxResources.resource; },
        wineSpending: function () { return ikariam.model.wineSpending; },
        resources: {
            wood: function () { return ikariam.model.currentResources.resource },
            wine: function () { return ikariam.model.currentResources[1]; },
            marble: function () { return ikariam.model.currentResources[2]; },
            crystal: function () { return ikariam.model.currentResources[3]; },
            sulfur: function () { return ikariam.model.currentResources[4]; }
        },
        // data: {
        //     townHall: function () {
        //         var townHall = {
        //         };
        //     },
        // }.
        // actionPoints: function () { return $("#value_maxActionPoints").text(); },
        population: function () { return ikariam.model.currentResources.population; },
        citizens: function () { return ikariam.model.currentResources.citizens; },
        producedTradegood: function () { return ikariam.model.producedTradegood; },
        tradegoodProduction: function () { return ikariam.model.tradegoodProduction; },
        resourceProduction: function () { return ikariam.model.resourceProduction; },
        realHour: function () { return ikariam.model.realHour; },
        serverName: function () { return ikariam.model.serverName; },
        serverTime: function () { return ikariam.model.serverTime; },
        nextETA: function () { return ikariam.model.nextETA; },

        // cityList: function () {
        //     get.tmp = { cityList: {} };
        //     $("#citySelect option").each(function () {
        //         var _v1 = $(this).attr("value");
        //         get.tmp.cityList[_v1] = {
        //             name: $(this).text().split("] ")[1],
        //             coords: tnt.getXY($(this).text())
        //         };
        //     });
        //     return get.tmp.cityList;
        // },
        cityList: function () {
            const cityList = {};
            $("#citySelect option").each(function () {
                const cityValue = $(this).attr("value");
                const cityText = $(this).text();
                cityList[cityValue] = {
                    name: cityText.split("] ")[1],
                    coordinates: tnt.getXY(cityText)
                };
            });
            return cityList;
        },
        p: {
            options: {
                playerId: function () { return $("#options_debug table td:eq(0)").text().replace(/[^\d-]+/g, ""); },
                playerName: function () { return $('#options_userData input[name="name"]').val(); }
            },
            island: {
                islandId: function () {
                    var islandCoords = tnt.getXY($("#breadcrumbs span.island").text());
                    return tnt.data.map[islandCoords.x][islandCoords.y][0];
                },
                playerId: function (el) { return $(".cityinfo .owner a.messageSend", el).length ? parseInt($(".cityinfo .owner a.messageSend", el).attr("href").split("&")[1].split("=")[1]) : get.playerId(); },
                playerName: function (el) { return $(".cityinfo .owner", el).text().split(" ")[1]; },
                alliance: function (el) { return $(".cityinfo .ally a:eq(0)", el).text(); },
                cityId: function (el) { return $("a:eq(0)", el).attr("id").replace(/[^\d-]+/g, ""); },
                cityName: function (el) { return $(".cityinfo .name:eq(0)", el).text().split(": ")[1]; },
                cityLevel: function (el) { return $(".cityinfo .citylevel", el).text().replace(/[^\d-]+/g, ""); },
                totalScore: function (el) { return $(".cityinfo .name:eq(1)", el).text().replace(/[^\d-]+/g, ""); }
            }
        }
    },

    has: {
        construction: function (el) {
            return $('.constructionSite').length > 0 ? true : false;
        }
    },

    view: {
        city: function (cityID) {
            $('div#dropDown_js_citySelectContainer li[selectValue="' + cityID + '"]').trigger('click');
        }
    },

    template: {
        resources: '<div id="tnt_info_resources"><span class="tnt_back"></span><div id="tnt_info_resources_content"></div>'
    }
};

$(document).ready(function () {
    //setTimeout(tnt.core.init, 1000);
    tnt.core.init();
});

// General styles
GM_addStyle("\
    /* Show level styles */\
    .tntLvl{\
        position:relative;\
        top:10px;\
        left:10px;\
        color:black;\
        line-height:13px;\
        background:gold;\
        font-size:9px;\
        font-weight:bold;\
        text-align:center;\
        vertical-align:middle;\
        height: 14px;\
        width: 14px;\
        border-radius: 50%;\
        border: 1px solid #000;\
        display: inline-block;\
    }\
    #tnt_resource_table{\
        border-collapse:collapse;\
        font: 12px Arial, Helvetica, sans-serif;\
    }\
    #tnt_resource_table td{\
        border:1px #000000 solid;\
        padding:2px!important;\
        // text-align:right;\
    }\
    #tnt_resource_table th{\
        border:1px #000000 solid;\
        padding:2px!important;\
        text-align:center;\
    }\
    .storage_min{\
        background-color: #FF000050;\
    }\
    .tnt_construction{\
        background-color: #80404050;\
    }\
    #tnt_resource_table tr.tnt_selected{\
        border:2px #000000 solid!important;\
    }\
    .tnt_resource_icon{\
        vertical-align:middle;\
        width:18px;\
        height:16px;\
        display:inline-block;\
    }\
    .tnt_population{\
        text-align:right;\
    }\
    .tnt_citizens{\
        text-align:right;\
    }\
    .tnt_wood{\
        text-align:right;\
    }\
    .tnt_marble{\
        text-align:right;\
    }\
    .tnt_wine{\
        text-align:right;\
    }\
    .tnt_crystal{\
        text-align:right;\
    }\
    .tnt_sulfur{\
        text-align:right;\
    }\
    #mainview a:hover{\
        text-decoration:none;\
    }\
    #tntOptions {\
        position:absolute;\
        top:40px;\
        left:380px;\
        width:620px;\
        border:1px #755931 solid;\
        border-top:none;\
        background-color: #FEE8C3;\
        //background: #DBBE8C url(/skin/layout/bg_stone.jpg) repeat scroll center top;\
        padding:10px 10px 0px 10px;\
    }\
    #tntOptions legend{\
        font-weight:bold;\
    }\
    .tntHide, #infocontainer .tntLvl, #actioncontainer .tntLvl{\
        display:none;\
    }\
    #tntInfoWidget {\
        position:fixed;\
        bottom:0px;\
        left:0px;\
        width:716px;\
        background-color: #DBBE8C;\
        z-index:100000000;\
    }\
    #tntInfoWidget .accordionTitle {\
        background: url(/cdn/all/both/layout/bg_maincontentbox_header.jpg) no-repeat;\
        padding: 6px 0 0;\
        width: 728px;\
    }\
    #tntInfoWidget .accordionContent {\
        background: url(/cdn/all/both/layout/bg_maincontentbox_left.png) left center repeat-y #FAF3D7;\
        overflow: hidden;\
        padding: 0;\
        position: relative;\
        width: 725px;\
    }\
    #tntInfoWidget .scroll_disabled {\
        background: url(/cdn/all/both/layout/bg_maincontentbox_left.png) repeat-y scroll left center transparent;\
        width: 9px;\
    }\
    #tntInfoWidget .scroll_area {\
        background: url(/cdn/all/both/interface/scroll_bg.png) right top repeat-y transparent;\
        display: block;\
        height: 100%;\
        overflow: hidden;\
        position: absolute;\
        right: -3px;\
        width: 24px;\
        z-index: 100000;\
    }\
    .txtCenter{\
        text-align:center;\
    }\
    #tnt_info_resources{\
        position:fixed;\
        bottom:20px;\
        left:0px;\
        width:auto;\
        height:auto;\
        background-color: #DBBE8C;\
        z-index:100000000;\
    }\
    .tnt_center{\
        text-align:center;\
        white-space:nowrap;\
    }\
    .tnt_right{\
        text-align:right;\
        white-space:nowrap;\
    }\
    .tnt_left{\
        text-align:left;\
        white-space:nowrap;\
    }\
    .tnt_bold{\
        font-weight:bold;\
    }\
    #tnt_info_resources .tnt_back, #tnt_info_resources .tnt_foreward {\
        background: url(/cdn/all/both/interface/window_control_sprite.png) no-repeat scroll transparent;\
        cursor: pointer;\
        display: block!important;\
        height: 18px;\
        width: 18px;\
    }\
    #tnt_info_resources .tnt_back {\
        left: 2px;\
        position: absolute;\
        top: 2px;\
        background-position: -197px 0;\
    }\
    #tnt_info_resources .tnt_back:hover {\
        background-position: -197px -18px;\
    }\
    #tnt_info_resources .tnt_foreward {\
        left: 2px;\
        position: absolute;\
        top: 3px;\
        background-position: -197px 0;\
        transform: rotate(180deg);\
    }\
    #tnt_info_resources .tnt_foreward:hover {\
        background-position: -197px -18px;\
    }\
");
// General styles - END
