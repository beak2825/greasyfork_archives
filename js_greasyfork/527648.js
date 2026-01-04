// ==UserScript==
// @name         Food Tierlist
// @namespace    com.firre.idlepixel
// @version      1.0
// @description  Shows which food is the best to cook
// @author       Firre
// @match        *://idle-pixel.com/login/play*
// @icon         data:image/image;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAACw4AAAsOAUC+4UEAAAtaSURBVGhDzVpZbxvXFT7DfdEua5e1JKL3WLIcB3GWhk7RokWaBDXaFGiQl7YIij70oQ9dgBSSfkGBog8BEmRrs3ZF0jqL41CxHSd1qjhetFiyVtJaKVESSZEUl+n3XZGOYks0ndgAP3s8M3eGM+c72z3njiXf0e3p6UwfZoUhvc9L/Onpf+sDF2fSZ9mRt0Reff1DfXoyIDX1ZR3poazISyJ+/6J7a2OF1DdVSE/PcHp0Y3g8nyvXy0siJ071d4RXYmIxGUXXRF748zE9fekajIzPKovlJZFIJOqORlfVsc1qFq/Pr46vxjPPv6eTKJHe5RdefcOjF5UUysx0QOYDIQkur8jDD911qLaqRN56t8cz6Z1X9yX0lNRUl8kD9+zsykuLGEwGKS50iA6HSqV0MRgMsrAQdL/93hmPzzcvKaifW3GRQ0qKHXLyk/78dK3i4kKx2y2iGTShi1nhXoOXJjtm55aUCzU1VqqtvLxIqqpKpcVVm59EKkoLu6jx2upSiceT4nBYxYltBQmgvKxQwE/BaDRIWXmhfPvQvs68JLK/3dXpHZ+TiopiuBWkxt9kMqWuFRTacaopMuQTjcTUeF4SISh4b++E3HNwhxQ4bBIIrqhxHeOJRFKRaWyolPm5RTWet0R++P17NZIJL0eUVUJLK6JpmpTDSjt3N8jetmYxIinc2e46xPvT3pa/+MMf/+UpKSlwh8JR0ZHBSoudcKdVlc127Ko59MD9bd28L++JvPCXY7qzwCbnzo8hqFu77r9vz4bVcN66VgbMTNQ2LbAZCSKviRx9/4xeUlogy8GIio9syGsi3km/Kk9oDZ3TfBbkLZFj3Wd117Y6WV1NyGo8gWi+BRb5z5HTnZ+fGc6pBf2qGB2bEafNKilYYgUZy4qSPhtyyloffdLXOTY+19GIZsdus6ixFHI7Jybv6KyEQiuybVv9ofsO7lKp8OvitTeO65U1pWKENw2PTaOMn1fv/fWvDm8qb1aLXL48537uxaO6yWjs2Lm9HoUcNITxBP0VNZBNM0qzq0Z06GM5FPG8iAZoeHjyhi318sse/bW/HldBcPLjPvdqMonC0SEjsArCQymMKTgbNiVy+r/9Hs+JXs/efbeJDu1fHPTJubOj0nthXHqR08/3jsuZ8yPSj3OmyGoUeHSDD0/1dTz97Nt6z2dDORE68s6nenlVsQxc9KnzoaFJz55dDbLoD0pCo4oAkCl0Zieyoak+6D7rWQxG3A0NW8Tn9Yt/Ppi+sjlUcQci1GAGKZQY7a3NXXfu37YhqVde6daTEHZgaFKVG4215dLa2iwJPOQCFMRHxmIJ8U0tyNa68q6f//Q7myrnGoscPXamc34+6GY8DPT7JLAQSl/JDqbI9SQI9hGRaLzj2Wfe0T/tGfSkhxX+9s+PPCPjM4rEFswVe3c2SHt7i0SRoXr7Jq6U6oGlsNL2PQe2rQ1sgmss8tLLH+i7W5vk/OejkkiXzl8Z+L0FZFzb6+gdEoBlw8hAMaRU9tpWswlluU0qK0sguCbeiTl2glcUQjKjGGPGeuq3P7pG1vX40sXnX3pf3wvTDg1elhCbfzzRiBckrzMZbYbMbykQEobU1pRJCVpYIwRLwaWMaGH5jvmlkIxDYE566wUiIVqtekux/PIXD+dGZGJiptNzsrejAS3k6PCUGrvaVW4mGFOsZomrX0MFYC6XQCAkfrjWvj1N8tjh+7ISuRIjbx8901GD/ndiZEY1/bcKlIYWYkxtBpKIryZVfBrxi5am6q70pU1xhYgJ/mq2miSeSikN3SprrH82dxu9hqsm/oVlSRk1KUJriyRw3VSuiBx593/6dletDF+akhiyBkuCJCa8DKhBajKjzcyWQeb6+vF1lzcE3SezXQ0mguIipzouR0bLBYpIEbouztZjCLipyQWZ9S+Lb3JeRsdnZWomsFZ94j6+k71y5k9GaLoir1HTHFdj6t/NwSSQ2a5GMpESh8OiVk/277vtum5FKCIhlMoTozOiQRIND6ZzJbExi0SQvZhRQugJ+E5SWi8AxZ7EhKWDCR/G8YyFvi6qK0qkrfX6bkUYnn7unc6TPYNycWRKEpBEtxrFgPS41petgbOJH/l9cnphbSANan8CJOOcF6CEeCyKB6QU6Q08JmeYzEbUWbNqtTFXaK+/f1o3OS2SQonACcqMumlmMiBL3oAEUe9EUbBxNYOVKFI/nVtsNrPynVgsrgiQ6O3NVfLkTx6RqroW+dmTv5OGrRW8JSdwRZG8+Sz1Cpz74OK//81jOavDYCixSRIk6A9xaBNPkfK6Urn9QLPYKgulHsWgFWM6CKTMBuVynCwjIAE7oLATKS1DQGKfwggPWCvlYhF2f7Te8tKKTE8H8NM1QozJGrz3RqC9ebZfjyUSaoJSMy183GoxSzgaw3M1mR2aFVmJS4HFol7ChodlNUWm/ky4p7m+EsrQxD/tl3AspaxaiwLwRrCMiS+wGFbWjkbj8sj37jp0oN2Vc3+jvXmhX6dJzQYj5pCkyuF6Ev6OY0SuWvW2aAYZv+ATMwzmaqnFuaYscgnp2oq5J2o1iD2pSSwUVfMRfTzbhHc1qDAmFn5CWIaVzFBq51M/zsGmX8BgMZrEYuJEmERvnERBF0ddZIBWjWK2mMSJZmoVLlffWi/V2C6vhOWjCyNyCak5we5zi0MqXZUSjMTEjp6hFHl/N/oJ9iiQB3VjSu1VelwHjnEO4T6zsFABF62oKOJUcCXlnjh52p0+zArtH8c/05NOs5jgOCzm6D8Mbn4pUit6OOYMq85hBe5XsWe1arNaEC9ri8jh6WWZnQqI1W6RXXWVYoGFh0anJRyKiA3zwd47mmSgz6vuJeiWNBqJMDJ4riIEz02iQzTgGlN5W9ttObmY4fA32jULXMbG7xEQ2AQy7CPiXCjGuRk+y36Z8wneIYwnZikrxjIkaLHSrUgQ+5tky/Yq6UOfXYjSgpZdQOnOFM0lz5aWGnX/epDMWq6C4HgnY9QIb2BXymyWa5woiz964A4t6g8rt2JKXaV7gZAFQc+XkASTgRljGuKGbSfvIzEnrMIYolty1ZzH9XvqZGzSL3fsaVQKYqabGJ8TJ667ttUqlyX4PLWSiLjkZoYCd+yoF5cLhPHw735rn1qgzgUQ5Qu8duRjT0lTuXuVgZ7QJQYTswU1QTgSo/B0LRVHCGq6XRz32EEmnP5OwbKCH2S8A1NSabKgbovJmG8O8WCQHbu2yo7bISS1DSMkED+UgG5kACFWCBWYzQf7vfLE4w9+Sbbr4ZqbPzzd1xk06h1iQ/aBVmJIhVwEIBwQmNaxgEQEZNgk8VxNmCq4cT/IWjhhwmfGz/vEqRlVwrhwbky5bE1tqTTWV0hxiVNMsALdlM4aCkZlbGQaVjJ0P/H4N3O2RAYbsu45O+xeNKU8wURcxYodLkYraYwlCMM5xmGzKisUQMiV2KpyqwjOSZLCZWKqyG6T6OKKDA1NKcGtqCIW54LKBYvMZuWyXIiz2Sxdjz5yd0511UbY1Hz83wenLk14UnaTKh0KEBcUnMKp7EIjIcnxGmFGCo8hyzmcVtyAKgAxw1hgtRBHa5CMgx7utSKQ6VpxWODRe9s2ff+N4roP+runRzeV269YRu1hhdBKVIqddlkKR1QlwKqZ67QqSYAU0wgTQCQeV6uSBI7EjJKgyWTvvrtt7UvTzUJOGukb8nWeGxyXgvqyDjZeTMecQDlpcoGZaZJCMwsZkLIdKGd0BHIcFmB4mWEhBrQEV+XBu3ffNCusxw09dNw74x7wznQsStJ9Z8vWrktzCxS+o7a4sNsbDLoXYB1+rIxDesaTIZqUOJJFodPadfhg21f2/1xwU7TzxpunOhkf9gKr/OChg7dU4I0h8n9lEyFI4C3CsQAAAABJRU5ErkJggg==
// @license      MIT
// @grant        none
// @require      https://update.greasyfork.org/scripts/441206/1112539/IdlePixel%2B.js
// @downloadURL https://update.greasyfork.org/scripts/527648/Food%20Tierlist.user.js
// @updateURL https://update.greasyfork.org/scripts/527648/Food%20Tierlist.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const COOKABLES = Object.keys(Cooking.FOOD_HEAT_REQ_MAP);

    class foodTierlistPlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("foodTierlist", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                },
                config: [
                    {
                        id: "raw_shrimp",
                        label: "Raw Shrimp: Enabled",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "raw_anchovy",
                        label: "Raw Anchovy: Enabled",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "raw_sardine",
                        label: "Raw Sardine: Enabled",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "raw_crab",
                        label: "Raw Crab: Enabled",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "raw_piranha",
                        label: "Raw Piranha: Enabled",
                        type: "boolean",
                        default: true
                    },
                ]
            });

        }




        initTierlist(){
            var availableItems = [];
            var profit = {};

            var allowedFish = {};
            allowedFish["raw_shrimp"] = this.getConfig("raw_shrimp");
            allowedFish["raw_anchovy"] = this.getConfig("raw_anchovy");
            allowedFish["raw_sardine"] = this.getConfig("raw_sardine");
            allowedFish["raw_crab"] = this.getConfig("raw_crab");
            allowedFish["raw_piranha"] = this.getConfig("raw_piranha");


            for (var key in Cooking.FOOD_HEAT_REQ_MAP){
                profit[key] = Cooking.ENERGY_MAP[key] / Cooking.FOOD_HEAT_REQ_MAP[key];
            }


            COOKABLES.forEach(item => {
                if($(`itembox[data-item="${item}"]`).css("display") != "none"){
                    if(allowedFish[item] == undefined || allowedFish[item] == true ){
                        availableItems.push(item);
                    }
                }
                $(`itembox[data-item="${item}"]`).css("border", "1px solid rgb(66, 66, 66)");
                $(`itembox[data-item="${item}"]`).css("border-radius", "5pt");
                $(`itembox[data-item="${item}"]`).css("background-color", "rgb(107, 107, 107)");
            });

            var availableProfit = availableItems.map((x) => [x,profit[x]] );

            availableProfit.sort((a, b) => a[1] - b[1]);

            var inc = availableProfit.length;
            var color = 255;
            var i = 0;

            availableProfit.forEach(item => {
                $(`itembox[data-item="${item[0]}"]`).css("background-color", "rgb(" + color + ", " + (255 - color) + ", 0)");

                color = 255-((255/inc) * i);
                if(i == availableProfit.length-1){
                    $(`itembox[data-item="${item[0]}"]`).css("border", "3px solid rgb(128, 255, 128)");
                    $(`itembox[data-item="${item[0]}"]`).css("border-radius", "50pt");
                }
                i++;

            });


        }

        onConfigsChanged() {
            this.initTierlist();
        }

        onMessageReceived(data) {
            if(data.startsWith("COOKING_RESULTS=") || data.startsWith("ANIMATION_XP_FADEIN_MENU_BAR=fishing")){
                setTimeout(() => this.initTierlist(), 1250);
            }
        }

        onLogin() {
            this.initTierlist();
        }



    }

    const plugin = new foodTierlistPlugin();
    IdlePixelPlus.registerPlugin(plugin);
})();