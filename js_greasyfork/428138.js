// ==UserScript==
// @name        Melvor Virtual Levels
// @namespace   github.com/gmiclotte
// @version		0.1.7
// @description Display level and xp numbers for virtual levels, similar to regular levels.
// @author		GMiclotte
// @include		https://melvoridle.com/*
// @include		https://*.melvoridle.com/*
// @exclude		https://melvoridle.com/index.php
// @exclude		https://*.melvoridle.com/index.php
// @exclude		https://wiki.melvoridle.com/*
// @exclude		https://*.wiki.melvoridle.com/*
// @inject-into page
// @noframes
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/428138/Melvor%20Virtual%20Levels.user.js
// @updateURL https://update.greasyfork.org/scripts/428138/Melvor%20Virtual%20Levels.meta.js
// ==/UserScript==

((main) => {
    const script = document.createElement('script');
    script.textContent = `try { (${main})(); } catch (e) { console.log(e); }`;
    document.body.appendChild(script).parentNode.removeChild(script);
})(() => {

    function addSummoningProgess() {
        // add summoning to combat skill progress menu
        const table = document.getElementById('combat-skill-progress-menu').children[0];
        const skillID = Skills.Summoning + '-1';
        const body = document.createElement('tbody');
        const row = body.insertRow();
        // header
        const header = document.createElement('th');
        header.className = 'text-center';
        header.scope = 'row';
        const headerImg = document.createElement('img');
        headerImg.className = 'skill-icon-xs';
        headerImg.src = 'https://cdn.melvor.net/core/v018/assets/media/skills/summoning/summoning.svg';
        header.appendChild(headerImg);
        row.appendChild(header);
        // level
        const level = document.createElement('td');
        level.className = 'font-w600 font-size-sm';
        const levelSmall = document.createElement('small');
        levelSmall.id = `skill-progress-level-${skillID}`;
        level.appendChild(levelSmall);
        row.appendChild(level);
        // progress %
        const percent = document.createElement('td');
        percent.className = 'font-w600 font-size-sm';
        const percentSmall = document.createElement('small');
        percentSmall.id = `skill-progress-percent-${skillID}`;
        percent.appendChild(percentSmall);
        row.appendChild(percent);
        // xp
        const xp = document.createElement('td');
        xp.className = 'font-w600 font-size-sm d-none d-md-table-cell';
        const xpSmall = document.createElement('small');
        xpSmall.id = `skill-progress-xp-${skillID}`;
        xp.appendChild(xpSmall);
        row.appendChild(xp);
        // progress bar
        const bar = document.createElement('td');
        const tooltipBar = document.createElement('div');
        tooltipBar.className = 'progress active';
        tooltipBar.style = 'height: 8px';
        tooltipBar.id = `skill-progress-xp-tooltip-${skillID}`;
        const barInnerDiv = document.createElement('div');
        barInnerDiv.className = 'progress-bar bg-info';
        barInnerDiv.id = `skill-progress-bar-${skillID}`;
        barInnerDiv.role = 'progressbar';
        barInnerDiv.style = 'width: 0%;';
        barInnerDiv.ariaValuenow = '0';
        barInnerDiv.ariaValuemin = '0';
        barInnerDiv.ariaValuemax = '100';
        tooltipBar.appendChild(barInnerDiv);
        bar.appendChild(tooltipBar);
        row.appendChild(bar);
        // add row to table
        table.appendChild(body);
        // add new Summoning elements to `skillProgressDisplay.elems`
        const elems = skillProgressDisplay.elems.get(Skills.Summoning)
        elems.level.push(levelSmall);
        elems.percent.push(percentSmall);
        elems.progress.push(barInnerDiv);
        elems.tooltip.push(skillProgressDisplay.createTooltip(tooltipBar, ''));
        elems.xp.push(xpSmall);
    }

    function startVirtualLevels() {
        addSummoningProgess();

        window.virtualLevels = {
            navLevelCap: undefined,
            pageLevelCap: undefined,
            xpCap: undefined,
            // method to save data to local storage
            save: () => {
                window.localStorage['virtualLevels'] = window.JSON.stringify(window.virtualLevels)
            },
            // method to update all skill displays
            update: () => {
                for (let id in SKILLS) {
                    updateSkillVisuals(Number(id));
                }
            },
            // set caps
            setCaps(level, xp, nav = undefined) {
                window.virtualLevels.navLevelCap = nav ?? level;
                window.virtualLevels.pageLevelCap = level;
                window.virtualLevels.xpCap = xp;
                window.virtualLevels.save();
                window.virtualLevels.update();
            },
        }

        if (window.localStorage['virtualLevels'] !== undefined) {
            const stored = window.JSON.parse(window.localStorage['virtualLevels']);
            Object.getOwnPropertyNames(stored).forEach(x => {
                window.virtualLevels[x] = stored[x];
            });
        }

        window.virtualLevels.save();

        //////////////////////////////////
        //show exp to next level past 99//
        //////////////////////////////////

        // skill page
        let updateSkillString = skillProgressDisplay.updateSkill.toString();
        // replace this with object name
        updateSkillString = updateSkillString.replaceAll(
            'this',
            'skillProgressDisplay',
        );
        // ignore showVirtualLevels
        updateSkillString = updateSkillString.replace(
            'showVirtualLevels',
            'true',
        );
        // always use the <99 display mode that shows xp
        updateSkillString = updateSkillString.replace(
            'level<99',
            'true',
        );
        // limit xp to xpCap if given
        updateSkillString = updateSkillString.replace(
            '`${xpText} / ${numberWithCommas(exp.level_to_xp(level+1))}`',
            'xp >= (virtualLevels.xpCap ?? Infinity) ? numberWithCommas(Math.floor(virtualLevels.xpCap)) : `${xpText} / ${numberWithCommas(exp.level_to_xp(level + 1))}`',
        );
        // limit level display to pageLevelCap if given
        updateSkillString = updateSkillString.replace(
            '`${level} / 99`',
            '`${Math.min(virtualLevels.pageLevelCap ?? Infinity, level)} / 99`',
        );
        // compute next level progress, if pageLevelCap set it to 100
        updateSkillString = updateSkillString.replace(
            'nextLevelProgress[skillID]',
            'level > virtualLevels.pageLevelCap ? 100 : 100 * (xp - exp.level_to_xp(level)) / (exp.level_to_xp(level + 1) - exp.level_to_xp(level))',
        );
        // hookup
        updateSkillString = updateSkillString.replace(
            'updateSkill(skillID){',
            'skillProgressDisplay.updateSkill = (skillID) => {',
        );
        // evaluate
        eval(updateSkillString);

        // navigation
        let updateNavString = skillNav.updateNav.toString();
        // replace this with object name
        updateNavString = updateNavString.replaceAll(
            'this',
            'skillNav',
        );
        // limit level display to navLevelCap if given
        updateNavString = updateNavString.replace(
            'showVirtualLevels?exp.xp_to_level(xp)-1:level',
            'Math.min(virtualLevels.navLevelCap ?? Infinity, exp.xp_to_level(xp)-1)',
        );
        // hookup
        updateNavString = updateNavString.replace(
            'updateNav(skillID){',
            'skillNav.updateNav = (skillID) => {',
        );
        // evaluate
        eval(updateNavString);

        // one-time update of all skill windows after a slight delay
        setTimeout(window.virtualLevels.update, 5000);

        ///////
        //log//
        ///////
        console.log("Melvor Virtual Levels Loaded");
    }

    function loadScript() {
        if (typeof confirmedLoaded !== typeof undefined && confirmedLoaded) {
            // Only load script after game has opened
            clearInterval(scriptLoader);
            startVirtualLevels();
        }
    }

    const scriptLoader = setInterval(loadScript, 200);
});