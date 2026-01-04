// ==UserScript==
// @name		Melvor Obstacle Filter
// @namespace	http://tampermonkey.net/
// @version		0.1.8
// @description	Agility course planner that allows you to filter agility obstacles based on skill of interest.
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
// @downloadURL https://update.greasyfork.org/scripts/430344/Melvor%20Obstacle%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/430344/Melvor%20Obstacle%20Filter.meta.js
// ==/UserScript==

((main) => {
    const script = document.createElement('script');
    script.textContent = `try { (${main})(); } catch (e) { console.log(e); }`;
    document.body.appendChild(script).parentNode.removeChild(script);
})(() => {

    function startObstacleFilter() {
        if (window.obstacleFilter !== undefined) {
            console.error('Obstacle Filter is already loaded!');
        } else {
            createObstacleFilter();
            // load after 5s to give Melvor Show Modifiers time to load
            setTimeout(loadObstacleFilter, 200);
        }
    }

    function createObstacleFilter() {
        window.obstacleFilter = {};

        obstacleFilter.log = function (...args) {
            console.log('Melvor Obstacle Filter:', ...args)
        }

        obstacleFilter.loadTries = 0;

        obstacleFilter.courseData = {
            course: Array(10).fill(-1),
            courseMastery: Array(10).fill(false),
            pillar: -1,
        }

        obstacleFilter.createMenu = () => {
            // create show modifiers instance
            obstacleFilter.showModifiers = new MICSR.ShowModifiers('', 'Melvor Obstacle Filter');
            // set names
            obstacleFilter.modalID = 'obstacleFilterModal';
            obstacleFilter.menuItemID = 'obstacleFilterButton';

            // clean up in case elements already exist
            MICSR.destroyMenu(obstacleFilter.menuItemID, obstacleFilter.modalID);

            // create wrapper
            obstacleFilter.content = document.createElement('div');
            obstacleFilter.content.className = 'mcsTabContent';
            obstacleFilter.content.style.flexWrap = 'nowrap';

            // create modal and access point
            obstacleFilter.modal = MICSR.addModal('Obstacle Filter', obstacleFilter.modalID, [obstacleFilter.content]);
            let style = document.createElement("style");
            document.head.appendChild(style);
            let sheet = style.sheet;
            sheet.insertRule('#obstacleFilterModal.show { display: flex !important; }')
            sheet.insertRule('#obstacleFilterModal .modal-dialog { max-width: 95%; display: inline-block; }')
            MICSR.addMenuItem('Obstacle Filter', 'assets/media/main/stamina.svg', obstacleFilter.menuItemID, obstacleFilter.modalID);

            // add filter card
            obstacleFilter.addFilterCard();

            // log
            obstacleFilter.log('added settings menu!')
        }

        obstacleFilter.addFilterCard = () => {
            obstacleFilter.filterCard = new MICSR.Card(obstacleFilter.content, '', '150px', true);
            obstacleFilter.filterCard.addButton('Import Agility Course', () => {
                const chosenAgilityObstacles = [];
                game.agility.builtObstacles.forEach(x => chosenAgilityObstacles.push(x.id));
                const agilityPassivePillarActive = game.agility.builtPassivePillar === undefined ? -1 : game.agility.builtPassivePillar.id;
                obstacleFilter.agilityCourse.importAgilityCourse(
                    chosenAgilityObstacles,
                    MASTERY[Skills.Agility].xp.map(x => x > 13034431),
                    agilityPassivePillarActive,
                );
            });
            const filterData = [
                [
                    {tag: 'all', text: 'All', media: 'assets/media/main/completion_log.svg'},
                    // {tag: 'golbinRaid', text: 'Golbin Raid', media: 'assets/media/main/raid_coins.svg'},
                    {tag: 'combat', text: 'Combat', media: 'assets/media/skills/combat/combat.svg'},
                    {tag: 'melee', text: 'Melee', media: 'assets/media/skills/attack/attack.svg'},
                    {tag: 'ranged', text: 'Ranged', media: 'assets/media/skills/ranged/ranged.svg'},
                    {tag: 'magic', text: 'Combat Magic', media: 'assets/media/skills/combat/spellbook.svg'},
                    {tag: 'slayer', text: 'Slayer', media: 'assets/media/skills/slayer/slayer.svg'},
                ],
                obstacleFilter.showModifiers.gatheringSkills.map(skill => {
                    return {
                        tag: skill,
                        text: skill,
                        media: `assets/media/skills/${skill.toLowerCase()}/${skill.toLowerCase()}.svg`,
                    }
                }),
                [
                    ...obstacleFilter.showModifiers.productionSkills.map(skill => {
                        return {
                            tag: skill,
                            text: skill,
                            media: `assets/media/skills/${skill.toLowerCase()}/${skill.toLowerCase()}.svg`,
                        }
                    }),
                    {tag: 'altMagic', text: 'Alt. Magic', media: 'assets/media/skills/magic/magic.svg'},
                ],
            ];
            filterData.forEach(row => {
                const container = obstacleFilter.filterCard.createCCContainer();
                container.style.display = 'block';
                container.style.flexWrap = 'nowrap';
                row.forEach(data => {
                    const id = `Obstacle Filter ${data.tag} Button`
                    const callback = () => {
                        const previousButton = document.getElementById(`Obstacle Filter ${obstacleFilter.filter.tag} Button`);
                        obstacleFilter.unselectButton(previousButton);
                        obstacleFilter.createCourse({...data});
                        const button = document.getElementById(`Obstacle Filter ${obstacleFilter.filter.tag} Button`);
                        obstacleFilter.selectButton(button);
                    };
                    const button = obstacleFilter.filterCard.createImageButton(data.media, id, callback, 'Small', data.text);
                    button.id = id;
                    container.appendChild(button);
                });
                obstacleFilter.filterCard.container.appendChild(container);
            });
            const modifierDiv = document.createElement('div');
            modifierDiv.id = 'show-obstacle-modifiers';
            obstacleFilter.filterCard.container.appendChild(modifierDiv);
            // collapse filterData
            obstacleFilter.filterData = [...filterData[0], ...filterData[1], ...filterData[2]];
            //create course card
            obstacleFilter.createCourse(obstacleFilter.filterData[0]);
            const button = document.getElementById(`Obstacle Filter ${obstacleFilter.filter.tag} Button`);
            obstacleFilter.selectButton(button);
        }

        obstacleFilter.createCourse = (filter) => {
            obstacleFilter.filter = filter;
            if (!obstacleFilter.courseCard) {
                obstacleFilter.courseCard = new MICSR.Card(obstacleFilter.content, '', '150px', true);
                obstacleFilter.agilityCourse = new MICSR.AgilityCourse(
                    obstacleFilter,
                    obstacleFilter.courseData,
                    obstacleFilter.filterData,
                );
            } else {
                obstacleFilter.courseCard.clearContainer();
            }
            obstacleFilter.agilityCourse.createAgilityCourseContainer(obstacleFilter.courseCard, filter);

            // finalize tooltips
            const tippyOptions = {allowHTML: true, animation: false, hideOnClick: false};
            obstacleFilter.tippyInstances = tippy('#obstacleFilterModal [data-tippy-content]', tippyOptions);
            obstacleFilter.tippySingleton = tippy.createSingleton(obstacleFilter.tippyInstances, {delay: [0, 200], ...tippyOptions});

            // select current setup
            const masteryMap = {};
            obstacleFilter.courseData.courseMastery.forEach((mastery, category) => {
                if (!mastery) {
                    return;
                }
                masteryMap[obstacleFilter.courseData.course[category]] = obstacleFilter.courseData.course[category] !== -1;
            });
            obstacleFilter.agilityCourse.importAgilityCourse([...obstacleFilter.courseData.course], masteryMap, obstacleFilter.courseData.pillar);
            obstacleFilter.agilityCourseCallback();
        }

        obstacleFilter.agilityCourseCallback = () => {
            obstacleFilter.modifiers = new PlayerModifiers();
            const course = obstacleFilter.courseData.course;
            const courseMastery = obstacleFilter.courseData.courseMastery;
            const pillar = obstacleFilter.courseData.pillar;
            // compute agility modifiers
            MICSR.addAgilityModifiers(course, courseMastery, pillar, obstacleFilter.modifiers)
            // print
            $('#show-obstacle-modifiers').replaceWith(
                obstacleFilter.showModifiers.printRelevantModifiersHtml(
                    obstacleFilter.modifiers,
                    `${obstacleFilter.filter.text} Obstacle Modifiers`,
                    obstacleFilter.filter.tag,
                    'show-obstacle-modifiers',
                ),
            );
        };

        obstacleFilter.selectButton = (button) => {
            button.classList.add('btn-primary');
            button.classList.remove('btn-outline-dark');
        }

        obstacleFilter.unselectButton = (button) => {
            button.classList.remove('btn-primary');
            button.classList.add('btn-outline-dark');
        }
    }

    function loadObstacleFilter() {
        // Loading script
        if (obstacleFilter.loadTries === 0) {
            obstacleFilter.log('loading...');
        }

        // check requirements
        obstacleFilter.loadTries++
        if (!checkRequirements(obstacleFilter.loadTries === 10)) {
            if (obstacleFilter.loadTries < 10) {
                setTimeout(loadObstacleFilter, 200);
            }
            return;
        }

        // create menu
        obstacleFilter.createMenu();
    }

    function checkRequirements(print = false) {
        let requirementsMet = true;

        const reqMicsrMajorVersion = 1;
        const reqMicsrMinorVersion = 6;
        const reqMicsrPatchVersion = 4;
        const reqMicsrPreReleaseVersion = undefined;

        let reqMicsrversion = `v${reqMicsrMajorVersion}.${reqMicsrMinorVersion}.${reqMicsrPatchVersion}`;
        if (reqMicsrPreReleaseVersion !== undefined) {
            reqMicsrversion = `${reqMicsrversion}-${reqMicsrPreReleaseVersion}`;
        }

        if (window.MICSR === undefined || !MICSR.versionCheck(false, reqMicsrMajorVersion, reqMicsrMinorVersion, reqMicsrPatchVersion, reqMicsrPreReleaseVersion)) {
            if (print) {
                obstacleFilter.log('Failed to load Melvor Obstacle Filter! '
                    + `\nMelvor Obstacle Filter requires "Melvor Idle Combat Simulator Reloaded" ${reqMicsrversion} or later.`
                    + '\nFind it here: https://github.com/visua0/Melvor-Idle-Combat-Simulator-Reloaded');
            }
            requirementsMet = false;
        }
        return requirementsMet;
    }

    function loadScript() {
        if (typeof confirmedLoaded !== typeof undefined && confirmedLoaded) {
            // Only load script after game has opened
            clearInterval(scriptLoader);
            startObstacleFilter();
        }
    }

    const scriptLoader = setInterval(loadScript, 200);
});