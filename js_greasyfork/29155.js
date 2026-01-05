// ==UserScript==
// @name        nemexia
// @namespace   nemexia
// @description nemexia helper
// @include     *game*.nemexia.com/*
// @exclude     *.nemexia.com/bot_check.php*
// @version     2.1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/29155/nemexia.user.js
// @updateURL https://update.greasyfork.org/scripts/29155/nemexia.meta.js
// ==/UserScript==
// noinspection JSUnresolvedReference

(function () {
    'use strict'

    const KEY_INACTIVE_COORDS = 'InactivePlayersCoords'
    const STEP_TIME = 60000
    const MAX_SOLARS = 40
    const searchQuery = window.location.search
    const scienceBests = [3, 17, 1, 6, 13, 14, 8, 9, 4, 10, 11, 12, 7, 19, 21, 22, 23, 5, 2]
    const availableSciences = {}

    /* $.post('ajax_admiral_equipment.php?uid=' + (new Date()).valueOf(), {
			type: 'setItemsStateChangeEquipped',
            changesList: [{ 'itemId': 775, 'state': true }]
		}, function(response) { console.log(response) }) */

    /* $.post('ajax_admiral_equipment.php?uid=' + (new Date()).valueOf(), {
			type: 'getItemsList'
		}, function(response) { console.log(response) }) */

    /* $.post('ajax_admiral_equipment.php', {
			type: 'generateItem'
		}, function(response) { console.log(response) }) */

    // Main entry point of the script
    function initNemexiaHelper() {
        const br = document.getElementById('bodyWrapper')
        if (br === null) {
            window.location.reload()
            return
        }

        handleMainPage()
        handleInboxPage()
        handleGalaxyPage()
        handleFleetPage()
        handleZonesPage()
        handleFactoryPage()
        handlePlayerInfoPage()
        // Add more functions to handle other pages if necessary
    }

    const researchOneScience = function () {
        //    researchesList
        $.post('ajax_laboratory.php', {
            type: 'loadScience'
        }, function (response) {
            const basics = $('<div>' + response['1'] + '</div>')
            const advanced = $('<div>' + response['2'] + '</div>')
            const master = $('<div>' + response['3'] + '</div>')
            const additional = $('<div>' + response['4'] + '</div>')
            basics.find('#researchesList .researchItem').each(function () {
                let id = parseInt($(this).find('.thumbnail').attr('id').toString().split('-')[1])
                availableSciences[id] = (!$(this).hasClass('inactive'))
            })
            advanced.find('#researchesList .researchItem').each(function () {
                let id
                id = parseInt($(this).find('.thumbnail').attr('id').toString().split('-')[1])
                availableSciences[id] = (!$(this).hasClass('inactive'))
            })
            master.find('#researchesList .researchItem').each(function () {
                let id
                id = parseInt($(this).find('.thumbnail').attr('id').toString().split('-')[1])
                availableSciences[id] = (!$(this).hasClass('inactive'))
            })
            additional.find('#researchesList .researchItem').each(function () {
                let id
                id = parseInt($(this).find('.thumbnail').attr('id').toString().split('-')[1])
                availableSciences[id] = (!$(this).hasClass('inactive'))
            })
            let i = 0
            for (i = 0; i < scienceBests.length; i++) {
                if (availableSciences[scienceBests[i]]) {
                    $.post('ajax_laboratory.php', {
                        type: 'researchScience',
                        id: scienceBests[i],
                        startType: 0
                    }, function (response) {
                        showDialogMessage('Researching ' + scienceBests[i] + ' = ' + response)
                        globalQueueLoad()
                        refreshSession('planet')
                    })
                    break
                }
            }
            if (i === scienceBests.length) {
                showDialogMessage('Cannot even research science')
            }
        }, 'json')
    }

    function waitForAndRun(condition, _func) {
        const intv = setInterval(function () {
            if (!condition()) return

            _func()
            clearInterval(intv)
        }, 1000)
    }

    // Function to handle the shipyard page of the game
    function handleFactoryPage() {
        if (window.location.toString().indexOf('ships.php') < 0) {
            return
        }

        setInterval(() => {
            $('span[id^="TimeDiff"]').each((i, el) => {
                $(el).on('mouseover', () => {
                    const text = $(el).text()
                    if (text.indexOf('@') >= 0) return

                    const finishTime = text.match(/\d+/g)?.map(str => parseInt(str))
                    if (!finishTime) return

                    const localTime = new Date(new Date().getTime() + (finishTime[0] * 3600 + finishTime[1] * 60 + finishTime[2]) * 1000).toLocaleTimeString()
                    Tip('@ > ' + localTime)
                })
                $(el).on('mouseout', UnTip)
            })
        }, 1000)

        waitForAndRun(() => $('structuresList'), () => {
            $('a.maxAmmount').each((_, el) => {
                const max = parseInt($(el).find('span').text())
                let time = $(el).parent().parent().find('div.shipTime > strong').text().match(/\d+/g).map(str => parseInt(str))
                $(el).on('mouseover', () => {
                    Tip(new Date(new Date().getTime() + max * (time[0] * 3600 + time[1] * 60 + time[2]) * 1000).toLocaleTimeString())
                })
                $(el).on('mouseout', UnTip)
            })
        })

        const urlObj = new URL(window.location.href)
        const work = urlObj.searchParams.get('work')
        const count = parseInt(urlObj.searchParams.get('count'))
        if (!work) return

        const shipId = work.match(/\d+/g)?.map(str => parseInt(str))[0]
        if (!shipId) return

        // const shipBuildTimeText = $('#structuresList>.structureItem>.wrapper>#ShipsAvaible-' + shipId).parent().find('div.shipTime>strong').text()
        // const buildTimeSplit = shipBuildTimeText.match(/\d+/g)?.map(str => parseInt(str))
        // if (!buildTimeSplit) return

        // let buildCount = count || 1
        // const secondsPerShipUnit = (parseInt(buildTimeSplit[0]) * 3600) + (parseInt(buildTimeSplit[1]) * 60) + parseInt(buildTimeSplit[2])
        // if (secondsPerShipUnit < 60) {
        //     buildCount = Math.floor(59 / secondsPerShipUnit)
        // }

        const buildShips = function (id, count) {
            const max = parseInt($('#ShipsMax' + id).text().toString())
            if (max === 0 || max < count) {
                window.location.assign('ships.php')
                return
            }

            $.post('ajax_ships.php', {
                type: 'train',
                count: count,
                ship_id: id
            }, function (json) {
                refreshSession('planet', () => {
                    refreshMax("Ships");
                    refreshQue("Ships");
                })

                if (json[0] === 'True') {
                    buildShips(id, count)
                }
            }, 'json')
        }

        buildShips(shipId, count || 1)
    }

    // Function to handle the building zones of the game
    function handleZonesPage() {
        if (window.location.toString().indexOf('zone_') < 0) {
            return
        }

        $('#buildingsList>dd').filter(function () {
            $(this).contextmenu(function (ev) {
                ev.preventDefault()
                const id = ev.target.getAttribute('id').toString()
                upgrade_level(parseInt(id))
            })
        })
        $('div[id^="playerB-"]').each((_, el) => {
            const id = parseInt($(el).attr('id').match(/\d+/g).map(str => parseInt(str)))
            $(el).contextmenu((ev) => {
                ev.preventDefault()
                $.post('ajax_buildings.php', {
                    obj: id,
                    type: 9,
                    race_id: RACE_ID,
                    x: strongBuildingPosition[RACE_ID][id].dblleft,
                    y: strongBuildingPosition[RACE_ID][id].dbltop,
                    type_zone: 1
                }, () => {
                    $(el).css({
                        'left': strongBuildingPosition[RACE_ID][id].dblleft,
                        'top': strongBuildingPosition[RACE_ID][id].dbltop
                    })
                })
            })
        })

        const prio = [1, 4, 11, 13, 14, 15, 2, 5, 3, 6, 12, 7, 8, 9, 17, 19, 20]
        const shouldBuild = searchQuery.indexOf('=build') > 0
        const buildOne = searchQuery.indexOf('=buildOne') > 0
        if (!shouldBuild) {
            return
        }

        const moveToNextPlanet = function () {
            const planetLinks = []
            let activePlanet
            $('#planetsListHolder > li:not(.bottom) > a').each(function () {
                planetLinks.push('' + $(this).attr('href'))
            })
            activePlanet = $('#planetsListHolder > li.active > a').attr('href')
            console.dir(planetLinks)
            console.log(activePlanet)
            let nextLink = 0
            for (let i = 0; i < planetLinks.length; i++) {
                if (planetLinks[i] === activePlanet) {
                    nextLink = (i + 1) % planetLinks.length
                    console.log('next ' + nextLink)
                    break
                }
            }

            setTimeout(function () {
                window.location.href = planetLinks[nextLink]
            }, 5000)
        }

        const setFactoryBots = function () {
            let fact_1 = 0
            let fact_2 = 0
            $.post('ajax_buildings.php', {
                obj: 11,
                type: 2,
                race_id: RACE_ID
            }, function (respFact1) {
                if (respFact1.current_level != null) {
                    fact_1 = parseInt(respFact1.current_level)
                }
                $.post('ajax_buildings.php', {
                    obj: 12,
                    type: 2,
                    race_id: RACE_ID
                }, function (respFact2) {
                    if (respFact2.current_level != null) {
                        fact_2 = parseInt(respFact2.current_level)
                    }
                    const maxRobots = fact_1 + 2 * fact_2
                    const maxMet = Math.min(10, maxRobots)
                    const maxCrs = maxRobots > 10 ? Math.min(10, maxRobots - 10) : 0
                    const maxGas = maxRobots > 20 ? Math.min(10, maxRobots - 20) : 0
                    console.log('mr: ' + maxRobots + 'mm: ' + maxMet + 'mc: ' + maxCrs + 'mg: ' + maxGas)
                    $.post('ajax_factory.php', {
                        metal: maxMet,
                        crystal: maxCrs,
                        gas: maxGas,
                        type: 'addRobots'
                    }, function (xml) {
                        console.log('robots: ' + xml)
                        if (!buildOne) {
                            moveToNextPlanet()
                        }
                    })
                }, 'json')
            }, 'json')
        }

        let unableToBuildCount = 0
        const builderBot = function (buildingId) {
            setTimeout(function () {
                $.post('ajax_buildings.php', {
                    obj: prio[buildingId],
                    type: 2, // Get info
                    race_id: RACE_ID
                }, function (info) {
                    if (info.reason === '') { // No errors, will attempt build
                        unableToBuildCount = 0
                        $.post('ajax_buildings.php', {
                            obj: prio[buildingId],
                            type: 3, // build
                            x: strongBuildingPosition[RACE_ID][prio[buildingId]].dblleft,
                            y: strongBuildingPosition[RACE_ID][prio[buildingId]].dbltop,
                            race_id: RACE_ID,
                            type_zone: (prio[buildingId] <= 10 ? 1 : (prio[buildingId] <= 17 ? 2 : 3))
                        }, function (response) {
                            if (response === 'ok') {
                                console.log('built ' + prio[buildingId])
                                refreshTimers()
                                refreshSession('planet')
                                globalQueueLoad()
                                builderBot(0)
                            } else {
                                console.log('Could not build ', prio[buildingId], 'Resp: ', response)
                                if (response.indexOf('queue is full') > 0) {
                                    researchOneScience()
                                    setFactoryBots()
                                    if (!buildOne) return
                                }

                                showDialogMessage('Will try building from the beginning in ' + STEP_TIME / 1000 + ' seconds!')
                                setTimeout(function () {
                                    refreshSession('planet')
                                    builderBot(0)
                                }, STEP_TIME)
                            }
                        })
                    } else {
                        unableToBuildCount++
                        console.log(info.reason + ' = cannot build ' + prio[buildingId], '. Failed so far', unableToBuildCount)
                        if (unableToBuildCount >= prio.length) {
                            // move to next steps (maybe next planet)
                            researchOneScience()
                            setFactoryBots()
                            unableToBuildCount = 0
                            if (!buildOne) return
                        }

                        builderBot((buildingId + 1) % prio.length)
                    }
                }, 'json')
            }, STEP_TIME / 6)
        }

        builderBot(0)

    }

    // Function to handle the main page of the game
    function handleMainPage() {
        // Add your code to handle the main page here

        const hots = $('#hotLinksMenu ul')
        const addToHots = function (title, onclick) {
            const listItem = document.createElement('li')
            const link = document.createElement('a')
            link.href = 'javascript:void(0);'
            link.onclick = onclick
            link.innerText = title
            listItem.append(link)
            hots.prepend(listItem)
        }

        addToHots('NextMission', function () {
            QuesterGetReward()
            QuesterLoad()
        })
        addToHots('Sun Check', function () {
            window.location.href = 'fleets.php?work=sun'
        })
        addToHots('BuildAll', function () {
            window.location.href = 'zone_resource.php?work=build'
        })
        addToHots('BuildOne', function () {
            window.location.href = 'zone_resource.php?work=buildOne'
        })
        addToHots('setTyphAttack', function () {
            $.post('ajax_options.php?uid=' + (new Date()).valueOf(), {
                type: 'setCommanderShipsPriority',
                'itemsList[]': ['8', '11', '12', '2', '3', '4', '5', '6', '7', '1', '9', '10'],
                tableType: 1,
                isTeam: 0
            }, function (resp) {
                showDialogMessage(resp)
            }, 'json')
        })
        addToHots('SetExecAttack', function () {
            $.post('ajax_options.php?uid=' + (new Date()).valueOf(), {
                type: 'setCommanderShipsPriority',
                'itemsList[]': ['9', '11', '12', '2', '3', '4', '5', '6', '7', '1', '8', '10'],
                tableType: 1,
                isTeam: 0
            }, function (resp) {
                showDialogMessage(resp)
            }, 'json')
        })
        addToHots('DestroyAll', () => {
            let bIds = [1, 4, 6, 10, 11, 8, 2, 3, 5, 7, 9, 12, 16, 17, 18, 19, 20, 21]
            let x = 0
            setInterval(() => {
                console.log(bIds[x % bIds.length])
                $.post('ajax_buildings.php', {
                    obj: bIds[x++ % bIds.length],
                    type: 8
                }, (resp) => console.log(resp))
            }, 3000)
        })
    }

    // Function to handle the inbox page
    function handleInboxPage() {
        // Add your code to handle the inbox page here
        if (window.location.toString().indexOf('options.php') <= 0) {
            return
        }

        let im = 0
        setInterval(function () {
            const tad = document.getElementById('TabAdministrative')
            if (tad.getAttribute('style').toString().length !== 0) {
                return
            }

            const msglst = document.getElementById('TabAdministrativeBox').children[0].children
            if (msglst[im].getAttribute('class').indexOf('messageItem') >= 0) {
                const bdy = msglst[im].children[1].children[1]
                if (bdy.children.length >= 3) {
                    const last = bdy.children[bdy.children.length - 1]
                    if (last.getAttribute('href').indexOf('returnSpy') > 0) {
                        const splt = last.getAttribute('href').split('=')
                        const fid = splt[1]
                        last.href = 'javascript:void(0);'
                        last.setAttribute('onclick', 'optInter' + fid + '= setInterval(function(){$.post("ajax_fleets.php",{type:"processSpy",fleet_id: ' + fid + '},function(response){let info = eval("(" + response + ")");if(info.locked == false){showDialogMessage(info.message); clearInterval(optInter' + fid + ')}});},1000);')
                        last.textContent = 'Spy Again'
                        const retz = document.createElement('a')
                        retz.setAttribute('href', 'javascript:void(0);')
                        retz.setAttribute('onclick', '$.post("ajax_fleets.php",{type:"returnFleet",fleet_id: ' + fid + '}, function(rs){showDialogMessage(rs);});')
                        retz.textContent = 'Return Spy'
                        retz.style.backgroundColor = '#31f101'
                        last.parentNode.appendChild(retz)
                        const first = bdy.children[0]
                        const cds = first.children[0].textContent.split(':')

                        $.post('ajax_info.php', {
                            type: 'squareInfo',
                            c1: parseInt(cds[0]),
                            c2: parseInt(cds[1]),
                            c3: parseInt(cds[2])
                        }, function (response) {
                            if (response !== '') {
                                if (response.indexOf('دقیقه') > 0 || response.indexOf('inute') > 0 || response.indexOf('ثانیه') > 0 || response.indexOf('econd') > 0 || response.indexOf('nline') > 0) retz.style.backgroundColor = '#AF1111'
                            }
                        })
                    }
                }
            }

            im++

            if (im >= msglst.length) {
                im = 0
            }
        }, 1000)
    }

    // Function to handle the galaxy page
    function handleGalaxyPage() {
        // Add your code to handle the galaxy page here
        if (window.location.toString().indexOf('galaxy.php') < 0) {
            return
        }

        let $galaxyAdditional = $('#galaxyAdditional')
        $galaxyAdditional.append($('<li>').append($('<a>', {
            id: 'FleetPirate',
            'class': 'protection',
            'href': 'galaxy.php' + searchQuery + '&work=pirate',
            'style': 'border:2px solid black; border-radius: 20px;'
        })))

        $galaxyAdditional.append($('<li>').append($('<a>', {
            id: 'FleetResource',
            'class': 'spaceAdv',
            'href': 'galaxy.php' + searchQuery + '&work=resource',
            'style': 'border:2px solid red; border-radius: 20px;'
        })))

        $galaxyAdditional.append($('<li>').append($('<a>', {
            id: 'FleetSpy',
            'class': 'advSearch',
            'href': 'galaxy.php' + searchQuery + '&work=spy',
            'style': 'border:2px solid red; border-radius: 20px;'
        })))

        $galaxyAdditional.append($('<li>').append($('<a>', {
            id: 'FleetAstro',
            'class': 'scrapOverview',
            'href': 'galaxy.php' + searchQuery + '&work=astro',
            'style': 'border:2px solid red; border-radius: 20px;'
        })))

        setInterval(() => {
            if ($('#galaxyHolder').css('display') !== 'block') {
                return
            }

            $('#galaxyPlanets > div[class^="planet "] > a').each(function () {
                const attribLink = $(this).attr('onmouseover').toString()
                let [pc1, pc2, pc3] = attribLink.match(/\d+/g).map(str => parseInt(str))

                $(this).contextmenu(function (ev) {
                    ev.preventDefault()
                    window.location.assign('fleets.php?c1=' + pc1 + '&c2=' + pc2 + '&c3=' + pc3)
                })
            })
        }, 1000)

        const urlObj = new URL(window.location.href)
        const work = urlObj.searchParams.get('work')
        const customCount = parseInt(urlObj.searchParams.get('count'))

        if (!work) return

        if (work === 'spy') {
            let initialC2 = parseInt($('input[id="c2"]').attr('value'))
            waitForAndRun(() => $('#galaxyHolder').css('display') === 'block', () => {
                const planets = $('#galaxyPlanets > div[class^="planet "] > a > span.canAttack')
                planets.each(function (index, element) {
                    setTimeout(function () {
                        element.style.opacity = '0.6'
                        const coords = $(element).parent().attr('onmouseover') // squareInfo(x, x, x);
                        eval(coords.replace('squareInfo', 'sendSpyToPlanet'))
                    }, 1000 * (index) + 1)
                })

                setTimeout(function () {
                    const C1 = $('input[id="c1"]').attr('value')
                    let C2 = parseInt($('input[id="c2"]').attr('value')) + 1
                    if (C2 === initialC2) {
                        return
                    }

                    if (C2 > MAX_SOLARS) {
                        C2 = 1
                    }

                    window.location.assign('galaxy.php?galaxy=' + C1 + '&solar=' + C2 + '&work=spy')
                }, 1000 * (planets.length + 1))
            })
            return
        }

        if (searchQuery.indexOf('astro') >= 0) {
            waitForAndRun(() => $('#galaxyHolder').css('display') === 'block', () => {
                let asteroids = $('#galaxyPlanets > div[class^="planet "] > a > img')
                asteroids.filter(function () {
                    return $(this).attr('src').includes('asteroid')
                }).each(function (i, element) {
                    setTimeout(function () {
                        element.style.opacity = '0.6'
                        const attribLink = $(element).parent().attr('onmouseover').toString()
                        let [pc1, pc2, pc3] = attribLink.match(/\d+/g).map(str => parseInt(str))

                        let postVars = 'type=SendFleet&'
                        postVars += 'ship[' + RACE_ID + '][11]=2&'
                        postVars += 'mission=8&'
                        postVars += 'speed=10&'
                        postVars += 'metal=0&'
                        postVars += 'crystal=0&'
                        postVars += 'gas=0&'
                        postVars += 'scrap=0&'
                        postVars += 'c1=' + pc1 + '&'
                        postVars += 'c2=' + pc2 + '&'
                        postVars += 'c3=' + pc3 + '&'
                        postVars += 'battle_rounds=5&'
                        postVars += 'speed_motivation=0&'
                        postVars += 'scrap_motivation=0&'
                        postVars += 'flight_hours=0&'
                        postVars += 'flight_minutes=5'

                        $.post('ajax_fleets.php', postVars, function (response) {
                            const info = JSON.parse(response)
                            if (!info.pass) {
                                if (info.info === 'شما بیش از سفینه های که دارید وارد کرده اید' || info.info === 'You dont have the selected ships') {
                                    clearInterval(pageInterval)
                                    window.location.assign('fleets.php')
                                }
                                return false
                            }

                            return true
                        })

                        let postV = 'type=SendFleet&'
                        postV += 'ship[' + RACE_ID + '][11]=2&'
                        postV += 'mission=8&'
                        postV += 'speed=10&'
                        postV += 'metal=0&'
                        postV += 'crystal=0&'
                        postV += 'gas=0&'
                        postV += 'scrap=0&'
                        postV += 'c1=' + pc1 + '&'
                        postV += 'c2=' + (pc3 === 24 ? pc2 + 1 : pc2).toString() + '&'
                        postV += 'c3=' + (pc3 === 24 ? 1 : pc3 + 1).toString() + '&'
                        postV += 'battle_rounds=5&'
                        postV += 'speed_motivation=0&'
                        postV += 'scrap_motivation=0&'
                        postV += 'flight_hours=0&'
                        postV += 'flight_minutes=5'

                        $.post('ajax_fleets.php', postV, function (response) {
                            const info = JSON.parse(response)
                            if (info.pass === '0') {
                                if (info.info === 'شما بیش از سفینه های که دارید وارد کرده اید' || info.info === 'You dont have the selected ships') {
                                    clearInterval(pageInterval)
                                    window.location.assign('fleets.php')
                                }
                                return false
                            }

                            return true
                        })
                    }, 1000 * (i + 1))
                })

                setTimeout(function () {
                    const C1 = $('input[id="c1"]').attr('value')
                    let C2 = parseInt($('input[id="c2"]').attr('value')) + 1
                    if (C2 > MAX_SOLARS) {
                        C2 = 1
                    }

                    window.location.assign('galaxy.php?galaxy=' + C1 + '&solar=' + C2 + '&work=astro')
                }, 1000 * (asteroids.length + 1))
            })
            return
        }

        if (['resource', 'pirate'].includes(work)) {
            const raceShipCount = [0, 4, 7, 17]
            const pirate = work === 'pirate'
            const shipId = pirate ? 3 : 1
            const missionId = pirate ? 7 : 3
            const shipCount = pirate ? raceShipCount : (customCount || 1)
            let inProgress = false
            setInterval(() => {
                if ($('#galaxyHolder')?.css('display') !== 'block') return
                if (inProgress) return

                inProgress = true

                const planets = $('span.planetName.inactive')
                planets.each(function (index, el) {
                    setTimeout(function () {
                        $(el).css({
                            'color': 'black',
                            'background': 'darkGray'
                        })
                        const attribLink = $(el).parent().attr('onmouseover').toString()
                        let [pc1, pc2, pc3] = attribLink.match(/\d+/g).map(str => parseInt(str))

                        console.log('coords: ', [pc1, pc2, pc3], ' - sending', shipCount, 'ships - mission: ', work)

                        let postVars = 'type=SendFleet&'
                        postVars += 'ship[' + RACE_ID + '][' + shipId + ']=' + shipCount + '&'
                        postVars += 'mission=' + missionId + '&'
                        postVars += 'speed=10&'
                        postVars += 'metal=0&'
                        postVars += 'crystal=0&'
                        postVars += 'gas=0&'
                        postVars += 'scrap=0&'
                        postVars += 'c1=' + pc1 + '&'
                        postVars += 'c2=' + pc2 + '&'
                        postVars += 'c3=' + pc3 + '&'
                        postVars += 'battle_rounds=5&'
                        postVars += 'speed_motivation=0&'
                        postVars += 'scrap_motivation=0&'
                        postVars += 'flight_hours=0&'
                        postVars += 'flight_minutes=5'

                        $.post('ajax_fleets.php', postVars, function (response) {
                            const info = JSON.parse(response)
                            if (info.pass) {
                                return true
                            }

                            if (info.info === 'شما بیش از سفینه های که دارید وارد کرده اید' || info.info === 'You dont have the selected ships') {
                                clearInterval(pageInterval)
                                window.location.assign('fleets.php?work=resource&count=' + (customCount || 1))
                                return false
                            }

                            $.post('ajax_fleets.php', {
                                type: 'maxFleets',
                                jsonEncode: 1
                            }, function (flightsResp) {
                                let flights = JSON.parse(flightsResp)
                                if (flights.count === flights.max) {
                                    clearInterval(pageInterval)
                                    window.location.assign('fleets.php?work=resource&count=' + (customCount || 1))
                                    return false
                                }
                            })
                        }, 3000 * (i + 1))
                    }, 3000 * (index) + 1)
                })

                setTimeout(function () {
                    const c1Input = $('input[id="c1"]')
                    const c2Input = $('input[id="c2"]')
                    const C1 = c1Input.attr('value')
                    let C2 = parseInt(c2Input.attr('value')) + 1
                    if (C2 > MAX_SOLARS) {
                        C2 = 1
                    }

                    c1Input.val(C1)
                    c2Input.val(C2)
                    $('div#galaxySearch > input.search').click()
                    inProgress = false
                }, 3000 * (planets.length + 1))
            }, 1000)
        }
    }

    // Function to handle the fleet page
    function handleFleetPage() {
        // Add your code to handle the fleet page here
        if (window.location.toString().indexOf('fleets.php') < 0) {
            return
        }

        setInterval(function () {
            showFleets()
            // refreshShips()
            let fleetsCount = $('#FleetsCount')
            if (fleetsCount) {
                $('a[onclick*="returnFleet"]:contains("Take back")').each((i, el) => $(el).contextmenu((ev) => {
                    ev.preventDefault()
                    returnFleet(parseInt($(el).attr('onclick').match(/\d+/g)))
                    showFleets()
                }))
            }
        }, STEP_TIME / 6)

        waitForAndRun(() => $('#simulatorForm'), () => {
            let buttonRow = $('#simulatorForm > div.buttonrow')
            let maxAllButton = $('<input>')
            maxAllButton.attr('name', 'maxall')
            maxAllButton.attr('type', 'button')
            maxAllButton.attr('value', 'MAX')
            maxAllButton.click(() => {
                $('#attackerScienceLevel-7').val(20)
                $('#attackerScienceLevel-10').val(15)
                $('#attackerScienceLevel-11').val(15)
                $('#attackerScienceLevel-12').val(15)
                $('#attackerScienceLevel-21').val(10)
                $('#attackerScienceLevel-22').val(10)
                $('#attackerScienceLevel-23').val(10)

                $('#defenderScienceLevel-7').val(20)
                $('#defenderScienceLevel-10').val(15)
                $('#defenderScienceLevel-11').val(15)
                $('#defenderScienceLevel-12').val(15)
                $('#defenderScienceLevel-21').val(10)
                $('#defenderScienceLevel-22').val(10)
                $('#defenderScienceLevel-23').val(10)

                $('[id^="attackerShipLevel-"]').val(10)
                $('[id^="defenderShipLevel-"]').val(10)
                simulatorChangeNames()

            })

            buttonRow.append(maxAllButton)
        })

        waitForAndRun(() => $('#flight_hours'), () => {
            const hoursSelector = $('#flight_hours')
            const minutesSelector = $('#flight_minutes')

            const getReturnTime = () => new Date(new Date().getTime() + (hoursSelector.val() * 2 * 3600 + minutesSelector.val() * 2 * 60) * 1000).toLocaleTimeString()

            const onSelectorChanged = (e) => {
                console.log('Selector changed', e.target)
                const returnElem = $('#return_time_calc')
                let returnTime = getReturnTime()
                if (returnElem?.length !== 1) {
                    $(e.target).parent().append('<span id="return_time_calc">' + returnTime + '<span>')
                } else {
                    returnElem.text(returnTime)
                }
            }

            hoursSelector.change(onSelectorChanged)
            minutesSelector.change(onSelectorChanged)
        })

        const urlObj = new URL(window.location.href)
        const work = urlObj.searchParams.get('work')
        const c1 = urlObj.searchParams.get('c1')
        const c2 = urlObj.searchParams.get('c2')
        const c3 = urlObj.searchParams.get('c3')
        const debug = !!urlObj.searchParams.get('debug')
        const discover = !!urlObj.searchParams.get('discover')
        const skip = parseInt(urlObj.searchParams.get('skip')) % MAX_SOLARS || 0
        const customCount = parseInt(urlObj.searchParams.get('count'))
        const [baseGal, baseSol] = urlObj.searchParams.get('from')?.match(/\d+/g)?.map(parseInt) || []
        const reserveFlights = parseInt((urlObj.searchParams.get('res') || urlObj.searchParams.get('reserve'))) || 0

        let atMax = false

        setInterval(() => {
            let fleetsCount = $('#FleetsCount')
            if (fleetsCount) {
                atMax = parseInt(fleetsCount.text()) >= parseInt($('#MaxFleets').text()) - reserveFlights
            }

            if (!$('#fleetHandler')) return
            const selector = $('div[id^="arrive2Time-"]')
            selector.off('mouseover')
            selector.each((_, el) => {
                $(el).on('mouseover', () => {
                    const text = $(el).text()
                    if (text.indexOf('@') >= 0) return

                    const fleetTime = text.match(/\d+/g)?.map(str => parseInt(str))
                    if (!fleetTime) return

                    const localTime = new Date(new Date().getTime() + (fleetTime[0] * 3600 + fleetTime[1] * 60 + fleetTime[2]) * 1000).toLocaleTimeString()
                    Tip('@ > ' + localTime)
                })
                $(el).on('mouseout', UnTip)
            })
        }, 1000)

        $('#TabChooseShips')?.css({'display': 'block'})
        $('#TabSendFleets')?.css({'display': 'block'})
        $('#battleRounds')?.css({'display': 'block'})
        $('#battle_rounds')?.val(5)
        $('#SendFleetButton')?.attr('onclick', 'SendFleet();')

        if (work === 'masspirate' && !!c1 && !!c2 && !!c3) {
            // Mass Pirate
            setInterval(function () {
                if (atMax) return


                selectMissionImg(7)
                shipInput.val(shipCount[RACE_ID]).trigger('change')
                SendFleet()
            }, STEP_TIME / 6)
        }

        let thisPlanet = $('#planetSwitch > div[class="trigger"] > big > span').text().match(/\d+/g).map(str => parseInt(str))
        let baseGalId = baseGal || thisPlanet[0]
        let baseSolId = baseSol || thisPlanet[1]

        if (work === 'pirate' || work === 'resource') {
            let targetList = JSON.parse(localStorage.getItem(KEY_INACTIVE_COORDS) || '[]')
                .sort((l, r) => l.c1 - r.c1 || l.c2 - r.c2 || l.c3 - r.c3)

            const pirate = work === 'pirate'
            let pirateShipCounts = [0, 4, 7, 17]

            let missionId = pirate ? 7 : 3
            let shipType = pirate ? 3 : 1
            let count = pirate ? pirateShipCounts[RACE_ID] : (customCount || 1)

            waitForAndRun(() => $('#FleetsCount'), () => {

                let iAttack = 0
                let attackPending = false

                const sendFlights = () => {
                    let orderedTargets = targetList.map((t) => ({
                        ...t,
                        'd': Math.abs(t.c2 - skip)
                    })).sort((l, r) => l.d > r.d ? 1 : -1)
                    debug && console.log('targetList', targetList,
                        'ordered', orderedTargets)

                    if (atMax || attackPending || orderedTargets.length === 0) {
                        debug && console.log('At max = ', atMax, ' attack pending ', attackPending, 'targets = ', orderedTargets.length)
                        return
                    }

                    const max = $('div#TabChooseShips')
                            ?.find('label[for="ship_' + RACE_ID + '_' + shipType + '"] > a')
                            ?.text()
                            ?.replace(/,/g, '')
                            ?.match(/\d+/g)?.map(str => parseInt(str))[0]
                        || 0

                    if (max === 0 || max < count) {
                        debug && console.log('Not enough ships')
                        return
                    }

                    debug && console.log(
                        'Up next target ', orderedTargets[iAttack], 'counting', iAttack,
                        '\nCoords ', orderedTargets[iAttack].c1 + ':' + orderedTargets[iAttack].c2 + ':' + orderedTargets[iAttack].c3)
                    let {
                        c1: pc1,
                        c2: pc2,
                        c3: pc3
                    } = orderedTargets[iAttack]

                    let postVars = 'type=SendFleet&'
                    postVars += 'ship[' + RACE_ID + '][' + shipType + ']=' + count + '&'
                    postVars += 'mission=' + missionId + '&'
                    postVars += 'speed=10&'
                    postVars += 'metal=0&'
                    postVars += 'crystal=0&'
                    postVars += 'gas=0&'
                    postVars += 'scrap=0&'
                    postVars += 'c1=' + pc1 + '&'
                    postVars += 'c2=' + pc2 + '&'
                    postVars += 'c3=' + pc3 + '&'
                    postVars += 'battle_rounds=5&'
                    postVars += 'speed_motivation=0&'
                    postVars += 'scrap_motivation=0&'
                    postVars += 'flight_hours=0&'
                    postVars += 'flight_minutes=5'

                    attackPending = true
                    $.post('ajax_fleets.php', postVars, function (response) {
                        attackPending = false
                        showFleets()
                        showDialogMessage(JSON.parse(response)?.info || 'Success')
                    })

                    iAttack = ++iAttack % orderedTargets.length
                }

                if (!discover && targetList.length > 0) {
                    debug && console.log('Will not discover. Target list has ', targetList.length, 'items')
                    setInterval(sendFlights, 3000)
                    return
                }

                if (targetList.length > 0) { // clean up target list to avoid duplicates
                    targetList = []
                    setInterval(sendFlights, 3000)
                }

                let sortedSols = Array.from({length: MAX_SOLARS - 1}, (_, i) => (baseSolId + i) % MAX_SOLARS)

                let iGalaxy = 0
                let galaxyPending = false
                const discoveryLoop = setInterval(() => {
                    if (galaxyPending) {
                        debug && console.log('Galaxy Pending ', galaxyPending)
                        return
                    }

                    if (iGalaxy >= sortedSols.length) {
                        showDialogMessage('All galaxies discovered.')
                        clearInterval(discoveryLoop)
                        localStorage.setItem(KEY_INACTIVE_COORDS, JSON.stringify(targetList))
                        return
                    }

                    const galaxySurfer = function (response) {
                        galaxyPending = false
                        const info = eval('(' + response + ')')
                        if (info.redirect) {
                            showDialogMessage('Galaxy response not successful')
                            return
                        }

                        const galHolder = $('<div>').html(info.response)
                        const inactivePlanets = galHolder.find('#galaxyPlanets > div.planet > a > span.inactive')
                        debug && console.log('found ', inactivePlanets.length, ' inactive')

                        inactivePlanets.each(function (i, el) {
                            const attribLink = $(el).parent().attr('onmouseover').toString()
                            let [pc1, pc2, pc3] = attribLink.match(/\d+/g).map(str => parseInt(str))
                            targetList.push({
                                c1: pc1,
                                c2: pc2,
                                c3: pc3
                            })
                        })
                    }

                    galaxyPending = true
                    $.post('ajax_galaxy.php', {
                        galaxy: baseGalId,
                        solar: sortedSols[iGalaxy++],
                        planets: 0,
                        page: 0
                    }, galaxySurfer)
                }, 3000)
            })
            return
        }

        if (work === 'astro') {
            let noShips = false
            setInterval(() => {
                const shipInput = $('#ship_' + RACE_ID + '_11')

                if (!shipInput) {
                    noShips = true
                    return
                }

                const max = $('div#TabChooseShips')
                        ?.find('label[for="ship_' + RACE_ID + '_11"] > a')
                        ?.text()
                        ?.replace(/,/g, '')
                        ?.match(/\d+/g)?.map(str => parseInt(str))[0]
                    || 0

                noShips = max < 1
            }, 1000)

            waitForAndRun(() => $('#FleetsCount'), () => {

                let sortedSols = Array.from({length: MAX_SOLARS - 1}, (_, i) => (baseSolId + i) % MAX_SOLARS)

                let shipsPending = false
                let infoPending = false
                let flightPending = false
                let galaxyPending = false
                let iGalaxy = 0

                setInterval(() => {
                    if (atMax || flightPending || shipsPending || infoPending || galaxyPending || noShips) {
                        debug && console.log('At max', atMax, 'astro pending', flightPending, 'galaxyPending', galaxyPending, 'no ships', noShips)
                        return
                    }

                    if (iGalaxy >= sortedSols.length) {
                        showDialogMessage('All galaxies discovered.')
                        iGalaxy = 0
                        return
                    }

                    const galaxyHandler = function (info) {
                        if (info.redirect) {
                            showDialogMessage('Galaxy response not successful')
                            return
                        }

                        const galHolder = $('<div>').html(info.response)

                        debug && console.log(galHolder)

                        let asteroids = galHolder.find('div#galaxyPlanets > div[class^="planet "] > a > img[src*="asteroid"]')

                        debug && console.log('found ', asteroids.length, ' asteroids = ', asteroids)

                        if (asteroids.length === 0) {
                            galaxyPending = false
                            debug && console.log('No asteroids found at ', baseGalId, sortedSols[iGalaxy])
                            return
                        }

                        refreshShips()

                        shipsPending = true
                        $.post("ajax_fleets.php", 'type=shipsCheck&ship[' + RACE_ID + '][11]=1&mission=8', function (info) {
                            shipsPending = false
                            debug && console.log('ships info:', info)
                            $('#mission').val(8)
                            $('#missionCargo').html('40000');
                            $('#missionLoad').html('40000');
                            $('#missionSpeed').html(String(info.speed));
                            $('#admiralTimeBonus').html(info.admiral_bonus);
                            $('#admiralEquipmentTimeBonus').html(info.admiral_equipment_bonus);
                            $('#csTimeBonus').html(info.cs_bonus);
                            $('#missionPopCounter').html(info.population + '');
                            $('#energy_percent').val(info.energy_percent + '');
                            $('#fuel').val(info.fuel + '');

                            $('#RowScrapMotivation').hide();
                            $('#battleRounds').hide();
                            $('#RowFlightTime').show();
                            $('#RowFlightTimeSelect').hide();
                            $('#missionInfo').hide();


                            asteroids.each((i, el) => setTimeout(() => {
                                const attribLink = $(el).parent().attr('onmouseover').toString()
                                let [pc1, pc2, pc3] = attribLink.match(/\d+/g).map(str => parseInt(str))

                                $('#target_c1').val(pc1);
                                $('#target_c2').val(pc2);
                                $('#target_c3').val(pc3);
                                FlyCheck();

                                const [h, m, s] = $('p#missionOneWay').text().match(/\d+/g).map(str => parseInt(str))
                                infoPending = true
                                $.post('ajax_info.php', 'type=squareInfo&c1=' + pc1 + '&c2=' + pc2 + '&c3=' + pc3, (resp) => {
                                    infoPending = false
                                    debug && console.log('address info ', resp)
                                    const respHtml = $('<div>').html(resp)
                                    debug && console.log(respHtml)

                                    const nextChangeStr = respHtml.find('small:contains("Next change")').parent().text().trim().split(' ')
                                    debug && console.log('next change time for ', [pc1, pc2, pc3], 'is at ', nextChangeStr)

                                    const nextChangeDate = new Date(nextChangeStr[2]+' '+nextChangeStr[3])
                                    if (nextChangeDate.getTime() - currentTime.getTime() > (h * 3600 + m * 60 + s) * 1000) {
                                        let postVars = 'type=SendFleet&'
                                        postVars += 'ship[' + RACE_ID + '][11]=1&'
                                        postVars += 'mission=8&'
                                        postVars += 'speed=10&'
                                        postVars += 'metal=0&'
                                        postVars += 'crystal=0&'
                                        postVars += 'gas=0&'
                                        postVars += 'scrap=0&'
                                        postVars += 'c1=' + pc1 + '&'
                                        postVars += 'c2=' + pc2 + '&'
                                        postVars += 'c3=' + pc3 + '&'
                                        postVars += 'battle_rounds=5&'
                                        postVars += 'speed_motivation=0&'
                                        postVars += 'scrap_motivation=0&'
                                        postVars += 'flight_hours=0&'
                                        postVars += 'flight_minutes=5'

                                        flightPending = true
                                        debug && console.log('sending astro flight to ', [pc1, pc2, pc3])
                                        $.post('ajax_fleets.php', postVars, (flightResp) => {
                                            flightPending = false
                                            debug && console.log('flight resp ', flightResp)
                                        }, 'json')
                                    }
                                })
                            }, (1 + i) * 5000))

                            setTimeout(() => galaxyPending = false, (asteroids.length + 1) * 3000)
                        }, 'json')
                    }

                    galaxyPending = true
                    $.post('ajax_galaxy.php', {
                        galaxy: baseGalId,
                        solar: sortedSols[iGalaxy++],
                        planets: 0,
                        page: 0
                    }, galaxyHandler, 'json')
                }, 3000)
            })
            return
        }

        console.error('should not be here')
    }

    // Function to handle the player info page
    function handlePlayerInfoPage() {
        if (window.location.toString().indexOf('playerInfo') < 0) {
            return
        }

        $('li > div#menuHolder-').each((_, holder) => {
            holder.children[0].getAttribute('href').toString()
            const massPirateBtn = $('<a class="sendFleet" href="' + holder.children[0].getAttribute('href').toString() + '&work=masspirate" onmouseover="Tip(\'Mass Pirate\');" onmouseout="UnTip();"></a>')
            massPirateBtn.css({opacity: 0.4})
            $(holder).append(massPirateBtn)
        })
    }

    // Call the main initialization function
    initNemexiaHelper()
})()
