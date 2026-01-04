// ==UserScript==
// @name         Quest Log Links
// @namespace    https://neopat.ch
// @license      GNU GPLv3
// @version      1.0
// @description  Adds clickable links to quest log task cards
// @author       Lamp
// @match        https://www.neopets.com/questlog/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500328/Quest%20Log%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/500328/Quest%20Log%20Links.meta.js
// ==/UserScript==

(function() {


tasks = document.getElementsByClassName('ql-task-description')

    for (i=0; i < tasks.length; i++){
        task = tasks[i].innerHTML;


        if (task == "Spin the Wheel of Excitement"){

            tasks[i].innerHTML = "<a target='_blank' href=https://www.neopets.com/faerieland/wheel.phtml>"+task+"</a>";
        }

                if (task == "Spin the Wheel of Misfortune"){

            tasks[i].innerHTML = "<a target='_blank' href=https://www.neopets.com/halloween/wheel/index.phtml>"+task+"</a>";
        }

                if (task == "Spin the Wheel of Mediocrity"){

            tasks[i].innerHTML = "<a target='_blank' href=https://www.neopets.com/prehistoric/mediocrity.phtml>"+task+"</a>";
        }


                    if (task == "Spin the Wheel of Knowledge"){

            tasks[i].innerHTML = "<a target='_blank' href=https://www.neopets.com/medieval/knowledge.phtmll>"+task+"</a>";
        }



                if (task == "Play a game"){

            tasks[i].innerHTML = "<a target='_blank' href=https://www.neopets.com/games/game.phtml?game_id=805&size=regular&quality=high&play=true>"+task+"</a>";
        }


                        if (task == "Groom your Neopet"){

            tasks[i].innerHTML = "<a target='_blank' href=https://www.neopets.com/home/index.phtml>"+task+"</a>";
        }


                        if (task == "Feed your Neopet"){

            tasks[i].innerHTML = "<a target='_blank' href=https://www.neopets.com/home/index.phtml>"+task+"</a>";
        }


                        if (task == "Purchase Item(s)"){

            tasks[i].innerHTML = "<a target='_blank' href=https://www.neopets.com/generalstore.phtml>"+task+"</a>";
        }

                        if (task == "Customise your Neopet"){

            tasks[i].innerHTML = "<a target='_blank' href=https://www.neopets.com/customise/>"+task+"</a>";
        }


    }

})();