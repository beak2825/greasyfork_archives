// ==UserScript==
// @name         Отчёты
// @namespace    http://tampermonkey.net/
// @version      2024-12-17
// @description  Скрипт для блога Камнеступов
// @author       OGRTSV / Смекалка (cat259349)
// @match        https://catwar.net/blog36670
// @icon
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525456/%D0%9E%D1%82%D1%87%D1%91%D1%82%D1%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/525456/%D0%9E%D1%82%D1%87%D1%91%D1%82%D1%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function setFunctionalityButton() {
        const container = document.querySelector("#send_comment_form > p:nth-child(3)");
        let button = document.createElement("input");
        button.type = "button";
        button.value = "Создать отчётность";
        button.style.marginLeft = "5px";
        button.onclick = () => main();
        container.append(button);
    } // Создали окно для формирования отчётности, запуск ф-ции main по клику

    function getCommentParts(comments) {
        comments.shift();
        let [headers, bodies] = [[], []];
        for (let item of comments) {
            headers.push(item.querySelector(".comment-info").innerHTML);
            bodies.push(item.querySelector(".parsed").innerHTML);
        }
        console.log([headers, bodies]);
        return [headers, bodies];
    } // загружаем innerHTML всех комментов в массив, разбиваем на два подмассива: инфо и тело. Не понял зачем нужен был цикл, удалил.

    function getCommentType(bodies) {
        let commentTypesList = [];
        //0 сбор гнёзд
        //1 осмотр расщелин
        //2 транспортировка и чистка
        //3 доступ к высотам
        //4 принятие под опеку
        //5 прекращение опеки
        //6 прокачка лу уз
        //7 благотворительный фонд
        //8 перенос
        for (let item of bodies) {
            const isFind = /Обнаружено/.test(item),
                  isFindings = /Находки/.test(item),
                  isScoutAccess = /Доступ Разведчика/.test(item),
                  isTopAccess = /Доступ Вершинника/.test(item),
                  isHistory = /История/.test(item),
                  isTakeToGuard = /готов взять/.test(item),
                  isTakeGuardianship = /взять меня/.test(item),
                  isTakeFromGuard = /желаю прекратить/.test(item),
                  isTakeOffGuardianship = /прошу убрать/.test(item),
                  isCount = /Количество/.test(item),
                  isMoved = /Перенес/.test(item),
                  hasID = /[0-9]/.test(item);
            if (isFind) {
                commentTypesList.push(0);
            } else if (isFindings) {
                commentTypesList.push(1);
            } else if (isHistory) {
                commentTypesList.push(2);
            } else if (isScoutAccess || isTopAccess) {
                commentTypesList.push(3);
            } else if (isTakeToGuard || isTakeGuardianship) {
                commentTypesList.push(4);
            } else if (isTakeFromGuard || isTakeOffGuardianship) {
                commentTypesList.push(5);
            } else if (isCount) {
                commentTypesList.push(7);
            } else if (isMoved) {
                commentTypesList.push(8);
            } else if (hasID) {
                commentTypesList.push(6);
            } else commentTypesList.push(-1);
        }
        return commentTypesList;
    } // Здесь мы создали массив с типами, определяем тип комментария и записываем в массив инфо о нём

    function getDateByString(date) {
        let day = new Date();
        if (date == "Вчера") {
            day = new Date(Date.now() - 86400000)
        }
        let dateNumber = day.getDate();
        let dateMonth = day.getMonth();
        const descript = [
            "января",
            "февраля",
            "марта",
            "апреля",
            "мая",
            "июня",
            "июля",
            "августа",
            "сентября",
            "октября",
            "ноября",
            "декабря"
        ];
        dateMonth = descript[dateMonth];
        return dateNumber + " " + dateMonth;
    }

    function getInfo(headers, bodies, commentTypesList) {
        const actions = [
            (commentBody, info) => {
                info.push(commentBody.match(/(?<=<b>Дата:<\/b> )([0-9]{1,2})(\.)([0-9]{1,2})(\.)([0-9]{2,4})/g)[0]);
                info.push("");
                info.push(commentBody.match(/(?<=<b>Участник:<\/b> )(.){1,}(?=<br>)/g)[0]);
                info.push(commentBody.match(/(?<=<b>Обнаружено:<\/b> )(.){1,}/g)[0]);
                info.push("");
                info.push("");
                return info;
            },
            (commentBody, info) => {
                info.push(commentBody.match(/(?<=<b>Период:<\/b> )([0-9]{1,2})(\.)([0-9]{1,2})(\.)([0-9]{2,4})/g)[0]);
                info.push("");
                info.push(commentBody.match(/(?<=<b>Участник:<\/b> )(.){1,}(?=<br>)/g)[0]);
                info.push(commentBody.match(/(?<=<b>Находки:<\/b> )(.){1,}/g)[0]);
                info.push("");
                info.push("");
                return info;
            },
            (commentBody, info) => {
                console.log(commentBody);
                info.push(commentBody.match(/(?<=<b>Дата:<\/b> )([0-9]{1,2})(\.)([0-9]{1,2})(\.)([0-9]{2,4})/g)[0]);
                let participant = commentBody.match(/(?<=<b>Участник:<\/b> )(.){1,}(?=<br><b>Пере)/g);
                if (participant == null) {
                    participant = commentBody.match(/(?<=<b>Участник:<\/b> )(.){1,}(?=<br><b>Унич)/g);
                }
                info.push("");
                info.push(participant[0]);
                info.push(commentBody.match(/(?<=предметы:<\/b> )(.){1,}(?=<br>)/g)[0]);
                let screenshot = commentBody.match(/(?<=src=")(.){1,}(?=">)/g);
                if (screenshot == null) {
                    screenshot = commentBody.match(/(?<=href=")(.){1,}(?=" )/g);
                }
                info.push("");
                info.push(screenshot[0]);
                return info;
            },
            (commentBody, info) => {
                info.push(commentBody.match(/(доступ Разведчика|доступ Вершинника)/g)[0]);
                let screenshot = commentBody.match(/(?<=src=")(.){1,}(?=">)/g);
                if (screenshot == null) {
                    screenshot = commentBody.match(/(?<=href=")(.){1,}(?=" )/g);
                }
                info.push("");
                info.push("");
                info.push("");
                info.push("");
                info.push("");
                info.push(screenshot[0]);
                return info;
            },
            (commentBody, info) => {
                info.push(commentBody.match(/(взять меня|готов взять)/g)[0]);
                info.push(commentBody.match(/[0-9]/g)[1]);
                return info;
            },
            (commentBody, info) => {
                info.push(commentBody.match(/(убрать меня из-под опеки|желаю прекратить опеку над)/g)[0]);
                info.push(commentBody.match(/[0-9]/g)[1]);
                info.push(commentBody.match(/по причине (.){1,}/g)[0]);
                return info;
            },
            (commentBody, info) => {
                let screenshot = commentBody.match(/(?<=src=")(.){1,}(?=">)/g);
                if (screenshot == null) {
                    screenshot = commentBody.match(/(?<=href=")(.){1,}(?=" )/g);
                }
                info.push("");
                info.push("");
                info.push("");
                info.push("");
                info.push("");
                info.push(screenshot[0]);
                return info;
            },
            (commentBody, info) => {
                info.push(commentBody.match(/(?<=<b>Дата:<\/b> )([0-9]{1,2})(\.)([0-9]{1,2})(\.)([0-9]{2,4})/g)[0]);
                info.push("");
                info.push(commentBody.match(/(?<=<b>Участник:<\/b> )(.){1,}(?=<br><b>Количество)/g)[0]);
                info.push("");
                info.push(commentBody.match(/(?<=перьев:<\/b> )[0-9]{1,3}/g)[0]);
                let screenshot = commentBody.match(/(?<=src=")(.){1,}(?=">)/g);
                if (screenshot == null) {
                    screenshot = commentBody.match(/(?<=href=")(.){1,}(?=" )/g);
                }
                if (screenshot != null) {
                    info.push(screenshot[0]);
                } else info.push("без скриншота");
                return info;
            },
            (commentBody, info) => {
                info.push(commentBody.match(/(?<=<b>Дата:<\/b> )([0-9]{1,2})(\.)([0-9]{1,2})(\.)([0-9]{2,4})/g)[0]);
                info.push("");
                info.push(commentBody.match(/(?<=<b>Участник:<\/b> )(.){1,}(?=<br><b>Пере)/g)[0]);
                let catCount = commentBody.match(/,/g);
                if (catCount == null) {
                    catCount = 1;
                } else catCount = catCount.length + 1;
                info.push("");
                info.push(catCount);
                info.push("");
                return info;
            }
        ];
        let infoList = [];
        for (let item in commentTypesList) {
            if (commentTypesList[item] > -1) {
                let info = [];
                info.push(headers[item].match(/(?<="num">)([0-9]){1,3}/g)[0]);
                info.push(headers[item].match(/(?<=<\/b> )(([0-9]{1,2} (января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря))|Сегодня|Вчера)/g)[0]);
                if (info[1] == "Сегодня" || info[1] == "Вчера") {
                    info[1] = getDateByString(info[1]);
                }
                info.push(headers[item].match(/(?<=\/cat)[0-9]{1,10}/g)[0]);
                info.push(headers[item].match(/[0-9]{1,2}:[0-9]{2}/g)[0]);
                //info = actions[commentTypesList[item]](bodies[item], info);
                try {
                    info = actions [commentTypesList[item]](bodies[item], info);
                } catch (error) {};
                infoList.push(info);
            } else infoList.push(-1);
        }
        return infoList;
    }
    function addFields(types) {
        const container = document.querySelector("#send_comment_form");
        let fields = [...document.querySelectorAll(".activity-field")];
        if (fields.length > 0) {
            for (let item of fields) {
                item.value = "";
            }
            return;
        }
        const headers = [
            "Сбор гнёзд",
            //"Осмотр расщелин",
            //"Транспортировка и чистка",
            //"Доступ к высотам",
            //"Принятие под опеку",
            //"Прекращение опеки",
            //"Прокачка ЛУ и УЗ",
            //"Благотворительный фонд",
            //"Перенос"
        ];
        for (let i in headers) {
            let p = document.createElement("p");
            let field = document.createElement("textarea");
            let header = headers[i];
            p.style.marginTop = "15px";
            p.append(header);
            container.append(p);
            p = document.createElement("p");
            p.append(field);
            field.className = "activity-field";
            field.style.marginBottom = "15px";
            field.style.height = "150px";
            field.style.width = "100%";
            container.append(p);
        }
    }
    function fillFields(info, types) {
        let fields = [...document.querySelectorAll(".activity-field")];
        for (let i in info) {
            if (types[i] > -1) {
                fields[types[0]].value += info[i].join("; ") + "\n";
            }
        }
    }

    function main() {
        let comments = [...document.querySelectorAll(".view-comment")];
        const [headers, bodies] = getCommentParts(comments);
        const commentTypesList = getCommentType(bodies);
        const infoList = getInfo(headers, bodies, commentTypesList);
        addFields();
        fillFields(infoList, commentTypesList);
    }
    setFunctionalityButton();
})();