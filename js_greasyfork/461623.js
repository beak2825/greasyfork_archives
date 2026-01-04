// ==UserScript==
// @name         Cookie Clicker Cheat Achievement Remover
// @namespace    *://orteil.dashnet.org/cookieclicker/
// @version      0.2.3
// @description  Removes the achievements "Cheated cookies taste awful" and "Third-party" every time cookie clicker is loaded
// @author       Ethan Grobin
// @match        https://orteil.dashnet.org/cookieclicker/*
// @match        http://orteil.dashnet.org/cookieclicker/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/461623/Cookie%20Clicker%20Cheat%20Achievement%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/461623/Cookie%20Clicker%20Cheat%20Achievement%20Remover.meta.js
// ==/UserScript==

//javascript taken from https://www.reddit.com/r/CookieClicker/comments/1momj1/heres_some_javascript_for_removing_unwanted/ and converted to a working userscript.
Game.DelCheatAchieve=function(achiv)
{
    if (typeof achiv==='string') //check if the achievement name is a string
    {
        if (Game.Achievements[achiv])
        {
            if (Game.Achievements[achiv].won==1)// check if you have the achievement
            {
                Game.Achievements[achiv].won=0;//remove the achievement
                if (Game.Achievements[achiv].hide!=3) Game.AchievementsOwned--; //decrease total achievements owned
                Game.recalculateGains=1;
            }
        }
    }
}
setTimeout(() => {Game.DelCheatAchieve('Cheated cookies taste awful');Game.DelCheatAchieve('Third-party');// call the above function with the achievement names
                  Game.Notify('Achievements Cleared','Cheat Achievements Cleared',[22,19]);}, 3000);// if it doesnt work, try making the number at the end bigger