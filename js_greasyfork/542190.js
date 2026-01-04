// ==UserScript==
// @name            HWHAdvExt
// @namespace       HWHAdvExt
// @version         0.0.5
// @license         Copyright ZingerY & orb 
// @description     Extension for Hero Wars Helper. Modifies the adventure button to fetch the paths from https://www.solfors.com. You can choose any path listed and it will do it automatically. HeroWarsHelper
// @author          ZingerY
// @match           https://www.hero-wars.com/*
// @match           https://apps-1701433570146040.apps.fbsbx.com/*
// @match           https://www.solfors.com/*

// @run-at          document-start
// @grant           GM_xmlhttpRequest
// @connect         solfors.com
// @downloadURL https://update.greasyfork.org/scripts/542190/HWHAdvExt.user.js
// @updateURL https://update.greasyfork.org/scripts/542190/HWHAdvExt.meta.js
// ==/UserScript==

(function () {
    if (!this.HWHClasses) {
        console.log('%cHeroWarsHelper not found', 'color: red');
        return;
    }

    console.log('%cHWH Adventure Extension loaded', 'color: green');
    const { addExtentionName, getSaveVal, I18N, popup, setSaveVal } = HWHFuncs;
    addExtentionName(GM_info.script.name, GM_info.script.version, GM_info.script.author);
    
    // Store original getPath method
    const originalGetPath = HWHClasses.executeAdventure.prototype.getPath;
    
    // Override getPath method
    HWHClasses.executeAdventure.prototype.getPath = async function () {
        const oldVal = getSaveVal('adventurePath', '');
        const keyPath = `adventurePath:${this.mapIdent}`;
        
        // Get paths from solfors.com
        const solforsPaths = await this.fetchSolforsPaths();
        
        // Prepare popup buttons
        const popupButtons = [
            {
                msg: I18N('START_ADVENTURE'),
                placeholder: '1,2,3,4,5,6',
                isInput: true,
                default: getSaveVal(keyPath, oldVal)
            },
            {
                msg: I18N('BTN_CANCEL'),
                result: false,
                isCancel: true
            }
        ];
        
        // Add Solfors path buttons if available
        if (solforsPaths) {
            ['blue', 'orange', 'green'].forEach(color => {
                if (solforsPaths[color]) {
                    popupButtons.unshift({
                        msg: `${color === 'blue' ? '🔵' : color === 'orange' ? '🟠' : '🟢'} ${color.charAt(0).toUpperCase() + color.slice(1)}: ${solforsPaths[color]}`,
                        result: solforsPaths[color],
                        isPathButton: true
                    });
                }
            });
        }
        
        const answer = await popup.confirm('SELECT PATH OR ENTER A CUSTOM PATH', popupButtons);
        
        if (!answer) {
            this.terminatеReason = I18N('BTN_CANCELED');
            return false;
        }

        let path = answer.split(',');
        if (path.length < 2) {
            path = answer.split('-');
        }
        if (path.length < 2) {
            this.terminatеReason = I18N('MUST_TWO_POINTS');
            return false;
        }

        for (let p in path) {
            path[p] = +path[p].trim();
            if (Number.isNaN(path[p])) {
                this.terminatеReason = I18N('MUST_ONLY_NUMBERS');
                return false;
            }
        }

        if (!this.checkPath(path)) {
            return false;
        }
        setSaveVal(keyPath, answer);
        return path;
    };
    
    // Method to fetch paths from solfors.com
    HWHClasses.executeAdventure.prototype.fetchSolforsPaths = async function () {
        try {
            // Get adventure ID
            const adventureInfo = await Caller.send('adventure_getInfo');
            const adventureId = adventureInfo.adventureId;
            console.log('Current adventure:', adventureId);
            
            if (!adventureId || adventureId < 1 || adventureId > 12) {
                console.log('Invalid adventure ID');
                return null;
            }
            
            const url = `https://www.solfors.com/adventure/${adventureId}`;
            console.log('Fetching paths from:', url);
            
            // Fetch page content
            const response = await new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    onload: resolve,
                    onerror: () => resolve(null)
                });
            });
            
            if (!response || response.status !== 200) {
                console.log('Failed to fetch Solfors page');
                return null;
            }
            
            // Improved path extraction
            const text = response.responseText.replace(/<[^>]*>/g, ' '); // Remove HTML tags
            const paths = {};
            
            // Regex to capture the full path including optional Boss suffix
            const pathRegex = /(Blue|Orange|Green)\s*:\s*((?:\d+-)*\d+)(?:-Boss(?:\(x\d+\))?)?/gi;
            let match;
            
            while ((match = pathRegex.exec(text)) !== null) {
                const color = match[1].toLowerCase();
                // Clean up the path - this now captures ONLY the numbers part (match[2])
                let pathValue = match[2] // This is the captured numbers part only
                    .trim()
                    .replace(/\s+/g, ''); // Remove all whitespace
                
                paths[color] = pathValue;
                console.log(`Found ${color} path: ${pathValue}`);
            }
            
            if (Object.keys(paths).length === 0) {
                console.log('No paths found in page content');
                console.log('Content sample:', text.substring(0, 500));
                return null;
            }
            
            return paths;
            
        } catch (error) {
            console.error('Error in fetchSolforsPaths:', error);
            return null;
        }
    };

})();