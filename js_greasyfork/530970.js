// ==UserScript==
// @name         Forlabs Teacher Schedule
// @namespace    http://tampermonkey.net/
// @version      2025-03-27
// @description  Получение расписание отдельного преподавателя в Форлабсе
// @author       dima
// @match        bki.forlabs.ru/app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=forlabs.ru
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530970/Forlabs%20Teacher%20Schedule.user.js
// @updateURL https://update.greasyfork.org/scripts/530970/Forlabs%20Teacher%20Schedule.meta.js
// ==/UserScript==

(function() {

var entries = [];

const button = document.createElement('button');
button.className = 'btn btn-secondary';
button.style.position = 'fixed';
button.style.right = '25px';
button.style.bottom = '10px';
button.title = 'Расписание преподавателя';
button.textContent = '👩‍🏫';
button.addEventListener('click', find);
document.body.appendChild(button);

async function find() {

	const q = prompt('Введите часть ФИО преподавателя').trim();

	if (!q) {
		alert('Ничего не найдено')
		return
	}

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    const get = async (id, total, current) => {
        const progress = Math.floor((current / total) * 50);
        const bar = '█'.repeat(progress) + '░'.repeat(50 - progress);
        console.log(`${bar} ${current}/${total} потоков...`);

        const res = await fetch('/lm-vendor/repositories/sched/get_schedule', {
            method: 'post',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
				'X-XSRF-TOKEN': Cookies.get('XSRF-TOKEN')
            },
            body: JSON.stringify({ stream_id: id }),
        });
        return await res.json();
    };

    let allEntries;

    if (entries.length > 0) {
        allEntries = entries;
    } else {
        let { streams, meta, entries: initialEntries } = await get(0, 1, 1);

        const studentStream = meta.stream_ids[0];
        streams = streams.filter(s => s.id !== studentStream);

        const otherEntries = [];
        for (const { id } of streams) {
            if (streams.findIndex(s => s.id === id) > 0) await delay(50);
            const data = await get(id, streams.length, streams.findIndex(s => s.id === id) + 1);
            otherEntries.push(...data.entries);
        }

        allEntries = [...initialEntries, ...otherEntries].filter(
            entry => !entry.room_name.toLowerCase().includes('онлайн')
        );
        entries = allEntries;
    }

    const teachers = [
        ...new Set(
            allEntries
                .map(e => e.lecturer_name)
                .filter(n => n.toLowerCase().includes(q.toLowerCase()))
        ),
    ].sort();

    if (!teachers.length) {
        alert('Преподаватель не найден');
        return;
    }

    let selectedTeacher = teachers[0];
    if (teachers.length > 1) {
        const choice = prompt(
            `Нашлись такие преподаватели:\n${teachers
                .map((t, i) => `${i + 1}. ${t}`)
                .join('\n')}\n\nКого вы имели ввиду? Ответьте цифрой 1-${teachers.length}`
        );
        selectedTeacher = teachers[+choice - 1] || selectedTeacher;
    }

    const filtered = allEntries.filter(e => e.lecturer_name === selectedTeacher);

    const now = new Date();
    const currentDay = now.getDay();
    const diff = currentDay === 0 ? 6 : currentDay - 1;
    const monday = new Date(now);
    monday.setDate(now.getDate() - diff);
    const currentDayInCycle = Math.floor((now - monday) / 86400000) + 1;
    const isUpper = currentDayInCycle <= 7;

    const formatDay = d => {
        const date = new Date(monday);
        date.setDate(monday.getDate() + (d - 1));
        const day = date.getDate();
        const month = new Intl.DateTimeFormat('ru', { month: 'long', day: 'numeric' })
            .format(date)
            .split(' ')[1];
        return `${day} ${month}`;
    };

    const createTable = (days, label) => {
        const grid = document.createElement('div');
        grid.className = 'grid';

        const header = [' ', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];
        const times = [
            '08:30–10:00',
            '10:10–11:40',
            '11:50–13:20',
            '13:50–15:20',
            '15:30–17:00',
            '17:10–18:50',
            '19:00–20:20',
        ];

        const validDays = days.filter(d => {
            const wd = (d - 1) % 7 + 1;
            return wd <= 6;
        });

        header.forEach((h, i) => {
            const cell = document.createElement('div');
            cell.className = 'header';
            if (i === 0) {
                cell.textContent = h;
            } else {
                const dayOfWeek = h;
                const formattedDate = formatDay(days[i - 1]);
                cell.innerHTML = `<div>${dayOfWeek}</div><div class="date">${formattedDate}</div>`;
                if (currentDayInCycle === days[i - 1]) {
                    cell.classList.add('today');
                }
            }
            grid.appendChild(cell);
        });

        times.forEach((t, i) => {
            const timeCell = document.createElement('div');
            timeCell.className = 'time';
            timeCell.textContent = t;
            grid.appendChild(timeCell);

            validDays.forEach(d => {
                const cell = document.createElement('div');
                cell.className = 'entry';
                const entry = filtered.find(e => e.day === d && e.position === i + 1);

				if (currentDayInCycle === d) {
					cell.classList.add('today');
				}

                if (entry) {
                    const room = document.createElement('div');
                    room.className = 'entry-room';
                    room.textContent = entry.room_name;
                    cell.appendChild(room);

                    const stream = document.createElement('div');
                    stream.className = 'entry-stream';
                    stream.textContent = entry.streams[0].name;
                    cell.appendChild(stream);

                    cell.title = entry.study_name;

                    if (isUpper ? entry.dayInCycle <= currentDayInCycle : entry.dayInCycle >= currentDayInCycle) {
                        cell.classList.add('current');
                    }
                }
                grid.appendChild(cell);
            });
        });

        return { grid, label };
    };

    const win = window.open('', '_blank');
    win.document.body.innerHTML = `
        <!DOCTYPE html>
        <html>
            <head>
                <title>${selectedTeacher}</title>
                <style>
                    body {
                        font-family: Verdana, sans-serif;
                        font-size: 14px;
                        line-height: 1.2;
                    }
					* { box-sizing: border-box }
                    h1 {
                        text-align: center
                    }
                    .tables {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 50px;
                        width: fit-content;
                        margin: auto;
                    }
                    .labels {
                        display: flex;
                        justify-content: space-around;
                    }
                    .entry-room {

                    }
                    .entry-stream {
                        opacity: 0.3;
                        font-size: 0.8em;
                    }
                    .grid {
                        display: grid;
                        grid-template-columns: 75px repeat(6, 130px);
                    }
                    .date {
                        font-size: 0.8em;
                    }
                    .grid > div {
                        padding: 10px;
						min-height: 62px;
						outline: 1px solid #8888880f;
						outline-offset: -0.5px;
					}
					.time {
						font-size: 1em;
						font-variant-numeric: tabular-nums;
					}
					.header {
                        font-weight: bold;
                    }
                    .week-label {
						margin-top: 1em;
                    }
					.today {
						background-color: #ffcb000d;
					}
                </style>
            </head>
            <body>
                <h1>${selectedTeacher}</h1>
                <div class="tables"></div>
                <div class="labels"></div>
            </body>
        </html>
    `;

    const current = createTable(isUpper ? [1, 2, 3, 4, 5, 6, 7] : [8, 9, 10, 11, 12, 13, 14], 'Текущая неделя');
    const next = createTable(isUpper ? [8, 9, 10, 11, 12, 13, 14] : [1, 2, 3, 4, 5, 6, 7], 'Следующая неделя');

    const tables = win.document.querySelector('.tables');
    tables.appendChild(current.grid);
    tables.appendChild(next.grid);

    const labels = win.document.querySelector('.labels');
    labels.innerHTML = `
        <div class="week-label">${current.label} (${isUpper ? 'верхняя' : 'нижняя'})</div>
        <div class="week-label">${next.label} (${isUpper ? 'нижняя' : 'верхняя'})</div>
    `;
}
})();