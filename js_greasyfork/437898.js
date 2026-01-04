// ==UserScript==
// @name         EventHero
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       achepta
// @include     /^https{0,1}:\/\/((www|qrator)\.heroeswm\.ru|178\.248\.235\.15)\/war\.php.+/
// @grant       unsafeWindow
// @grant    GM_xmlhttpRequest
// @grant    GM_log
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/437898/EventHero.user.js
// @updateURL https://update.greasyfork.org/scripts/437898/EventHero.meta.js
// ==/UserScript==

(function (window, undefined) {
    let w;
    if (typeof unsafeWindow !== undefined) {
        w = unsafeWindow;
    } else {
        w = window;
    }
    if (w.self !== w.top) {
        return;
    }
    unsafeWindow.getNearestEnemy = getNearestEnemy

    let lt = null;
    let enemies = null;

    let startId;
    startId = setInterval(main, 200)


    function main() {
        if (!stage[war_scr].obj[activeobj]) {
            return
        } else {
            window.clearInterval(startId)
        }
        if (btype === 142) {
            setInterval(checkState, 200)
        }
    }


    function checkState() {
        console.log(lt)
        if (lt !== activeobj) {

            let currentObj
            try {
                currentObj = stage[war_scr].obj[activeobj]
                lt = activeobj
            } catch (error) {
                throw error
            }


            if (currentObj.owner === 1) {
                if (enemies == null) {
                    enemies = []
                    setEnemies()
                }
                if(currentObj.id === 622) {
                    let enemy = getNearestEnemy(84)
                            doAttack(enemy.x, enemy.y)
                } else {
//doDefend()
                }
            }
        }
    }

    function doDefend() {
        defend_button_release()
    }

    function doWait() {
        wait_button_release()
    }

    function doMagic(magic, ax, ay) {
        loadmy('battle.php?warid='+warid+'&move=1&pl_id='+player+'&magical='+ magic+ '&my_monster='+activeobj+'&x='+stage[war_scr].obj[activeobj].x+'&y='+stage[war_scr].obj[activeobj].y+'&ax='+ax+'&ay='+ay+'&lastturn='+lastturn+'&lastmess='+lastmess+'&lastmess2='+lastmess2+'&magicp='+0+'&rand='+mathrandom());
    }

    function doAttack(ax, ay) {
        loadmy('battle.php?warid='+warid+'&move=1&pl_id='+pl_id+'&attack=1'+'&my_monster='+activeobj+'&x='+stage[war_scr].obj[activeobj].x+'&y='+ stage[war_scr].obj[activeobj].y+'&ax='+ax+'&ay='+ay+'&lastturn='+lastturn+'&lastmess='+lastmess+'&lastmess2='+lastmess2+'&magicp='+0+'&rand='+mathrandom());
    }

    function setEnemies() {
        for (const [key, value] of Object.entries(stage[war_scr].obj)) {
            if (stage[war_scr].obj[activeobj].side !== value.side && value.dead === 0 && value.hero !== 1) {
                enemies.push(value)
            }
        }
    }
    function getNearestEnemy(id) {
        enemies = enemies.filter(enemy => enemy.dead === 0)
        let enemy = null;
        switch (id) {
            case 84: {
                enemy = enemies[1]
                break
            }
        }
        return enemy
    }

    function getTotalHealth(creature) {
        return (creature['nownumber']-1)*creature['maxhealth']+creature['nowhealth']
    }
// helpers
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return parts.pop().split(';').shift();
        } else {
            return null
        }
    }

    function doGet(url, callback) {
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            overrideMimeType: "text/xml; charset=windows-1251",
            onload: function (res) {
                callback(new DOMParser().parseFromString(res.responseText, "text/html"))
            }
        });
    }

    function doPost(url, params, callback) {
        GM_xmlhttpRequest({
            method: "POST",
            url: url,
            data: params,
            onload: callback,
        });
    }

    function removeElement(element) {
        element.parentNode.removeChild(element)
    }

    function $(id, where = document) {
        return where.querySelector(`#${id}`);
    }

    function get(key, def) {
        let result = JSON.parse(localStorage[key] === undefined ? null : localStorage[key]);
        return result == null ? def : result;

    }

    function set(key, val) {
        localStorage[key] = JSON.stringify(val);
    }

    function getScrollHeight() {
        return Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
    }

    function getClientWidth() {
        return document.compatMode === 'CSS1Compat' && document.documentElement ? document.documentElement.clientWidth : document.body.clientWidth;
    }

    function findAll(regexPattern, sourceString) {
        let output = []
        let match
        let regexPatternWithGlobal = RegExp(regexPattern, [...new Set("g" + regexPattern.flags)].join(""))
        while (match = regexPatternWithGlobal.exec(sourceString)) {
            delete match.input
            output.push(match)
        }
        return output
    }
})(window);