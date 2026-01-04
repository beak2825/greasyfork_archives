// ==UserScript==
// @name         Forum revolts themes helper
// @name:ru		 Помощник форумных тем о бунтах
// @namespace    http://grepolis.scripts/
// @version      1.3.6
// @description  Getting revolts information in a unified manner
// @description:ru  Сбор информации о бунтах из заголовков тем на форуме
// @author       Grepolis players
// @include      /^https?:\/\/.*\.grepolis\.com\/(?:game|forum).*$/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418939/Forum%20revolts%20themes%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/418939/Forum%20revolts%20themes%20helper.meta.js
// ==/UserScript==


// Valid theme title: Ocean/City/Revolt start time/God
// Example:
// 54/Рассвет/03:15:40/Аид
(function() {
    'use strict';
	let themes = {
		outdates: [],
		unparsed: [],
		revolts: [],
        tripwires: []
	};
    let toShow = false;
    let requestsToWait = 0;
    const headers = {
        tripwires: '[center][size=12][color=#0B0B8A]СБИТ МАЯК[/color][/size][/center]',
        finished: '[center][size=12][color=#0B0B8A]БУНТ ОКОНЧЕН[/color][/size][/center]',
        soon: '[center][size=12][color=#0B0B8A]БУНТ СКОРО НАЧНЕТСЯ[/color][/size][/center]',
        current: '[center][size=12][color=#0B0B8A]БУНТ ИДЕТ[/color][/size][/center]'
    };
    const alerts = {
        withoutHelen: '(без учета Елены)',
        needBiremes: '[b][color=#A00000]нужен деф, море[/color][/b]',
        stopDef: '[color=#006E00][b]СТОП ДЕФ![/b][/color]',
        needDef: '[b][color=#A00000]нужен деф[/color][/b]',
        finishedRevolt: '[color=#006E00]Бунт окончен[/color]'
    };

    jQuery(document).ajaxComplete(function(event, xhr, settings){
        const type = settings.url.replace(/.*action=(.*)&h.*/g, "$1");
        if (type === 'forum') {
            addForumControl();
        }
    });

    function addForumControl() {
        const threadTitle = document.getElementById('threadtitle');
        const descriptionEl = document.getElementById('forum_description') || threadTitle;

        const aboutRevoltsLink = document.getElementById('aboutrevolts');
        const eraseRevoltsLink = document.getElementById('eraserevolts');
        if (aboutRevoltsLink) {
            aboutRevoltsLink.parentElement.removeChild(aboutRevoltsLink);
        }
        if (eraseRevoltsLink) {
            eraseRevoltsLink.parentElement.removeChild(eraseRevoltsLink);
        }

        const link = document.createElement('a');
        link.setAttribute('id', 'aboutrevolts');
        link.appendChild(document.createTextNode('О бунтах'))
        link.style.float = 'right';
        if (threadTitle) {
            link.style.backgroundColor = 'white';
        }

        const eraseLink = document.createElement('a');
        link.setAttribute('id', 'eraserevolts');
        eraseLink.appendChild(document.createTextNode('(сброс)'))
        eraseLink.style.float = 'right';
        if (threadTitle) {
            eraseLink.style.backgroundColor = 'white';
        }
        if (descriptionEl) {
            eraseLink.addEventListener('click', erase);
            descriptionEl.appendChild(eraseLink);
            link.addEventListener('click', handleClick);
            descriptionEl.appendChild(link);
        }
    }

	function handleClick() {
        if (document.querySelector('.thread')) {
            parseThemes();
        } else {
            parseTripwires();
        }
        toggleOutput();
	}

    function getTime(timeStr) {
        const timeStrChunks = timeStr.split(/\.\.\.?/);
        return timeStrChunks.length === 1 ? onlyTime(timeStr) : `${onlyTime(timeStrChunks[0])}...${onlyTime(timeStrChunks[1])}`;
    }

    function onlyTime(timeStr) {
        let result = '???';
        if (timeStr !== '???') {
            const [, hours, minutes, seconds] = /([0-9]|[0-2][0-9]).([0-5]?[0-9]).?([0-5]?[0-9])?/.exec(timeStr);
            result = `${hours}:${minutes}:${seconds ? seconds : '00'}`;
        }
        return result;
    }

    function formatGod(godStr) {
        return godStr.charAt(0).toUpperCase() + godStr.slice(1).toLowerCase();
    }

    async function updateCityBb(name, owner, startTime, citiesData) {
        let response;

        try {
            response = await fetch(`/autocomplete?q=${encodeURIComponent(name)}&limit=500&what=game_town`);
            const namesData = await response.text();

            const responseCities = namesData.split('\n');
            let filteredCities;
            if (responseCities.length > 0 && responseCities[0] !== '') {
                filteredCities = responseCities.filter(responseCity => {
                    return responseCity.split('|')[1].toLowerCase() === name.toLowerCase();
                });
            }
            if (filteredCities && filteredCities.length > 1 && responseCities[0] !== '') {
                filteredCities = filteredCities.filter(filteredCity => {
                    return filteredCity.split('|')[2].toLowerCase() === owner.toLowerCase();
                });
            }

            if (filteredCities && filteredCities.length === 1) {
                citiesData.filter(cityData => {
                    return name.toLowerCase() === cityData.name.toLowerCase() && startTime.valueOf() === cityData.startTime.valueOf();
                })[0].bb = `[town]${filteredCities[0].split('|')[0]}[/town]`;
            }
        } finally {
            requestsToWait--;
        }
    }

    function parseThemes() {
        requestsToWait = 0;
		Array.from(document.querySelectorAll('.thread')).forEach(thread => {
			let author = thread.querySelector('.author a').firstChild.nodeValue;
			const postTimeTextified = thread.querySelector('.author .date').firstChild.nodeValue;
			const timeChunks = postTimeTextified.trim().split(' ');
			const postTime = new Date(
				Number(timeChunks[0].split('.')[2]),
				Number(timeChunks[0].split('.')[1] - 1),
				Number(timeChunks[0].split('.')[0]),
				Number(timeChunks[1].split(':')[0]),
				Number(timeChunks[1].split(':')[1])
			);

			const title = thread.querySelector('.title a').firstChild.nodeValue;
            if (title.indexOf('(') > 0) {
                author = title.replace(/^[^(]+\(/,'').replace(/\).*$/,'');
            }
			let titleChunks = title.split(/\/|\\|\(/).map(chunk => chunk.trim());

			const oneDay = 1000 * 60 * 60 * 24;
			if ((new Date() - postTime) / oneDay > 3) {
				if (!themes.outdates.filter(outdate => outdate.title === title && outdate.author === author).length) {
					themes.outdates.push({
						title,
						author
					});
				}
			} else if (titleChunks.length > 2) {
				if (!themes.revolts.filter(revolt => revolt.name === titleChunks[1]).length) {
                    const oceanNumberRe = /\d{1,2}/;
                    const timeRe = /^(?:[0-9]|[0-2][0-9])[:.-](?:[0-5][0-9])/;
                    const godRe = /(?=Аид)|(?=Гера)|(?=Посейдон)|(?=Зевс)|(?=Афина)|(?=Артемида)|(?=Афродита)|(?=Арес)|(?=Бога нет)/i;
                    const stopRe = /Стоп/i;

                    const oceanNumber = oceanNumberRe.test(titleChunks[0].replace(/\D/g, '')) ? Number(titleChunks[0].replace(/\D/g, '')) : '?';
                    let revoltTime = '';
                    let god = '';
                    let recognizedChunks = [];
                    if (oceanNumber !== '?') {
                        recognizedChunks.push(0);
                    }
                    for (let i = 1; i < titleChunks.length; i++) {
                        if (timeRe.test(titleChunks[i])) {
                            revoltTime = getTime(titleChunks[i]);
                            recognizedChunks.push(i);
                        }
                        if (godRe.test(titleChunks[i])) {
                            god = formatGod(titleChunks[i]);
                            recognizedChunks.push(i);
                        }
                    }
                    let startTime = new Date(postTime.getTime());
                    let [hours, minutes, seconds] = revoltTime.replace(/\.\..*$/, '').split(/\.|:|-/);
                    startTime.setHours(hours);
                    startTime.setMinutes(minutes);
                    if (typeof seconds !== 'undefined') {
                        startTime.setSeconds(seconds);
                    }
                    if (startTime < postTime) {
                        startTime.setDate(startTime.getDate() + 1);
                    }

                    let endTime = new Date(postTime.getTime());
                    [hours, minutes, seconds] = revoltTime.replace(/^.*\.\./, '').split(/\.|:|-/);
                    endTime.setHours(hours);
                    endTime.setMinutes(minutes);
                    if (typeof seconds !== 'undefined') {
                        endTime.setSeconds(seconds);
                    }
                    if (endTime < postTime) {
                        endTime.setDate(endTime.getDate() + 1);
                    }

                    let name;
                    if (oceanNumber === '?') {
                        name = titleChunks[0];
                    } else if (recognizedChunks.includes(1)) {
                        const titleChunksIndexes = titleChunks.map((title, index) => index);
                        name = titleChunks[titleChunksIndexes.filter(index => !recognizedChunks.includes(index))[0]] || '???';
                    } else {
                        name = titleChunks[1];
                    }

                    if (isNaN(startTime)) {
                        themes.unparsed.push({
                            title,
                            author
                        });
                    } else {
                        themes.revolts.push({
                            author,
                            ocean: oceanNumber,
                            name,
                            bb: '',
                            startTime,
                            endTime,
                            revoltTime,
                            god,
                            isStop: stopRe.test(title)
                        });
                        requestsToWait++;
                        updateCityBb(name, author, startTime, themes.revolts).then(show);
                    }
				}
			} else {
				if (!themes.unparsed.filter(unparsed => unparsed.title === title && unparsed.author === author).length) {
					themes.unparsed.push({
						title,
						author
					});
				}
            }
        });
	}

    function timeToNativeFormat(humanReadStr) {
        const nowDate = new Date();
        let dateStr = humanReadStr.replace('сегодня', `${nowDate.getDate()}.${nowDate.getMonth() + 1}.${nowDate.getYear() % 100}`);
        let days, months, years, hours, minutes, seconds;
        [, days, months, years, hours, minutes, seconds] = /(\d{1,2}).(\d{1,2}).(\d{1,2}) в (\d{1,2}):(\d{1,2}):(\d{1,2})/.exec(dateStr);
        return new Date(Math.floor(nowDate.getFullYear() / 100) * 100 + Number(years), months - 1, days, hours, minutes, seconds);
    }    

    function add12Hours(aDate) {
        aDate.setHours(aDate.getHours() + 12);
        return aDate;
    }

    function parseTripwires() {
        requestsToWait = 0;
        const reports = document.getElementsByClassName('published_report');
        let skippedPosts = 0;

        for (let i = 0; i < reports.length; i++) {
            const revoltedCityEl = reports[i].querySelector('.published_report_header .gp_town_link:nth-child(3)');
            const revoltedOwnerEl = reports[i].querySelector('.published_report_header .gp_player_link:nth-child(4)');
            const revoltedTimesHumanReadEl = reports[i].querySelector('.reports_date.small');
            if (!revoltedCityEl || !revoltedOwnerEl || !revoltedTimesHumanReadEl) {
                skippedPosts++;
                continue;
            }

            const name = revoltedCityEl.firstChild.nodeValue;
            const owner = revoltedOwnerEl.firstChild.nodeValue;
            const startTime = add12Hours(timeToNativeFormat(revoltedTimesHumanReadEl.firstChild.nodeValue.trim()));

            if (!themes.tripwires.filter(tripwire => tripwire.name === name && tripwire.startTime.valueOf() === startTime.valueOf()).length) {
                themes.tripwires.push({
                    startTime,
                    name
                });

                requestsToWait++;
                updateCityBb(name, owner, startTime, themes.tripwires).then(show);
            }
        }
    }

	function toggleOutput() {
		const outputEl = document.getElementById('revolts')? document.getElementById('revolts'): addOutputField();

		if (outputEl.value) {
			outputEl.value = '';
            outputEl.style.display = 'none';
            toShow = false;
		} else {
            outputEl.style.display = 'block';
			themes.revolts.sort((revoltA, revoltB) => {
                if (revoltA.ocean < revoltB.ocean) {
                    return -1;
                } else if (revoltA.ocean > revoltB.ocean) {
                    return 1;
                }

                return revoltA.startTime - revoltB.startTime;
			});

            toShow = true;
            show();
		}
	}

    function show() {
        if (requestsToWait) {
            return;
        }

		const outputEl = document.getElementById('revolts')? document.getElementById('revolts'): addOutputField();

        let cities = '';
        let currentOcean = '';
        let finishedRevolts = themes.revolts.filter(revolt => Math.abs(new Date - revolt.endTime) / 36e5 > 12)
        if (finishedRevolts.length) {
            cities += `\n${headers.finished}\n`;
            finishedRevolts.forEach(revolt => {
                cities += `${revolt.bb ? revolt.bb :' ' + revolt.name.toUpperCase()} ${alerts.finishedRevolt}\n`;
            });
        }


        if (themes.tripwires.length) {
            cities += `\n${headers.tripwires}\n\n`;
            themes.tripwires.sort((a, b) => a.startTime - b.startTime);
            themes.tripwires.forEach(tripwire => {
                if (tripwire.bb) {
                    cities += `${tripwire.bb ? tripwire.bb : ' ' + tripwire.name.toUpperCase()} [b]${('0' + tripwire.startTime.getHours()).substr(-2)}:${('0' + tripwire.startTime.getMinutes()).substr(-2)}:${('0' + tripwire.startTime.getSeconds()).substr(-2)}[/b] ${tripwire.startTime.getDate()}.${('0' + (tripwire.startTime.getMonth() + 1)).substr(-2)}.${tripwire.startTime.getYear() % 100} ${alerts.withoutHelen} ${alerts.needBiremes}\n`;
                }
            });
        }

        let futureRevolts = themes.revolts.filter(revolt => new Date(revolt.startTime) > new Date());
        if (futureRevolts.length) {
            cities += `\n${headers.soon}\n`;
            futureRevolts.forEach(revolt => {
                if (revolt.ocean !== currentOcean) {
                    cities += `\n[center][b]${revolt.ocean} океан[/b][/center]\n\n`;
                    currentOcean = revolt.ocean;
                }
                const actionText = revolt.isStop ? alerts.stopDef: alerts.needDef;
                cities += `${revolt.bb ? revolt.bb :' ' + revolt.name.toUpperCase()} [b]начало ${revolt.revoltTime}[/b] стена +, ${revolt.god}, Б-Т-Ф-П ${actionText}\n`;
            });
        }
        currentOcean = '';
        let currentRevolts = themes.revolts.filter(revolt => new Date(revolt.endTime) < new Date() && Math.abs(new Date - revolt.endTime) / 36e5 < 12);
        if (currentRevolts.length) {
            cities += `\n${headers.current}\n`;
            currentRevolts.forEach(revolt => {
                if (revolt.ocean !== currentOcean) {
                    cities += `\n[center][b]${revolt.ocean} океан[/b][/center]\n\n`;
                    currentOcean = revolt.ocean;
                }
                const actionText = revolt.isStop ? alerts.stopDef: alerts.needDef;
                cities += `${revolt.bb ? revolt.bb :' ' + revolt.name.toUpperCase()} [b]начало ${revolt.revoltTime}[/b] стена +, ${revolt.god}, Б-Т-Ф-П ${actionText}\n`;
            });
        }

        if (themes.unparsed.length) {
            cities += '\nНе по формату\n';
            themes.unparsed.forEach(unparsed => {
                cities += `${unparsed.title} (${unparsed.author})\n`;
            });
        }

        outputEl.value = cities;
    }

	function addOutputField() {
		const outputContainer = document.createElement('textarea');
        outputContainer.setAttribute('id', 'revolts');
		outputContainer.style.display = 'block';
		outputContainer.style.width = '90%';
		outputContainer.style.height = '250px';
		outputContainer.style.margin = '0 auto';

		const container = document.querySelector('.threadlist_container') || document.querySelector('.game_list.view_topic');
		container.insertBefore(outputContainer, container.firstChild);
		return outputContainer;
	}

	function erase() {
		themes = {
			outdates: [],
			unparsed: [],
			revolts: [],
            tripwires: []
		};

		const outputEl = document.getElementById('revolts');

		if (outputEl && outputEl.value) {
            outputEl.value = '';
            outputEl.style.display = 'none';
        }
	}
})();
