// ==UserScript==
// @name         המכחול של ניב
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  צובע ניקים בכל רחבי האתר.
// @author       RemixN1V - Niv
// @match        https://www.fxp.co.il/*
// @resource     BalloonCSS https://scripts.remixn.xyz/Balloon.css
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/428976/%D7%94%D7%9E%D7%9B%D7%97%D7%95%D7%9C%20%D7%A9%D7%9C%20%D7%A0%D7%99%D7%91.user.js
// @updateURL https://update.greasyfork.org/scripts/428976/%D7%94%D7%9E%D7%9B%D7%97%D7%95%D7%9C%20%D7%A9%D7%9C%20%D7%A0%D7%99%D7%91.meta.js
// ==/UserScript==

// function for creating user HTML
function userA(username, tatnick, tatnickfont, userClass, userStyle, userId, manager) {
    return `<span class="balloonNoBorder" data-remix-balloon="${tatnick}" data-remix-balloon-pos="left" style="--fontfam: ${tatnickfont}" ><a title='' style='${userStyle}' class='${userClass}${manager ? ' RemixTeam' : ''}' href='member.php?u=${userId}'>${username}</a></span>`;
}

// function for make tat nick
async function getTat(userClass, tatnick) {
    ///*
    if (tatnick[0]?.src) {
        let img = tatnick[0].src;

        const worker = await Tesseract.createWorker('eng');
        const worker2 = await Tesseract.createWorker('heb');
        const res = await worker.recognize(`https://api.remixn.xyz/image?url=${img}`);
        const res2 = await worker2.recognize(`https://api.remixn.xyz/image?url=${img}`);
        let text = res.data.text+res2.data.text;

        let tats = {
            'WINHER': 'FXP WINNER', '[Fin Cham,': 'FXP CHAMP', 'TRL Cok)': 'FXP GOLD',
            'מצב"ל הקהילה': 'מנכ"ל הקהילה לשעבר',
            'יום הולד"ת': 'יום הולדת שמח!',
            'ראשי החודש': 'ראשי החודש'
        },
            weektats = {
                'ךא ,': 'מנהל השבוע',
                '': 'משתמש השבוע'
            },
            bluetats = {
                'פקח החודש': 'מפקח החודש',
                '630 סוה הקהול הקסהל': 'שנה בגבוהה',
                'יום הולד"ת': 'יום הולדת שמח!',
                'מפקח הטרה': 'מפקח השנה'
            };

        let f_tat = Object.keys(tats).find(x => text.includes(x));
        let f_week = Object.keys(weektats).find(x => text.includes(x) && userClass.includes('weekenduser'));
        let f_blue = Object.keys(bluetats).find(x => text.includes(x) && userClass.includes('blueuser'));

        if (f_week) return weektats[f_week];
        if (userClass.includes('blueuser')) {
            if (f_blue) return bluetats[f_blue];
            return 'כנראה מצטיין או משהו'
        }
        if (f_tat) return tats[f_tat]

        else {
            //console.log('נסה לזהות את התת ניק:', userClass, text);
            return 'לא הצלחתי לזהות... תנסה אתה: '+text;
        }


        await worker.terminate();
        await worker2.terminate();
    } else {//*/
        switch (userClass.split('niv ')[1]) {
            case 'champ':
                return 'FXP CHAMP';

            case 'glory':
                return 'FXP GLORY';

            case 'weekenduser':
                return 'משתמש/מנהל השבוע';

            case 'mankalpast':
                return 'כנראה תת ניק של מנכ"ל לשעבר...'

            case 'respectuserplus':
                return 'משתמש כבוד פלוס!';

            case 'chairman':
                return 'מור אחי...';

            case 'proprio':
                return 'ארז אחי...'

            default:
                return '! כנראה שמדובר בתת ניק ריק... !';
        }
    }
}

// function for getting data from user profile
async function getUser(user) {
    let userId, username, tatnick, tatnickfont, userClass, userStyle, url;
    if (!isNaN(user)) url = 'u';
    else url = 'username';

    return fetch(`https://www.fxp.co.il/member.php?${url}=${user}`).then(x => x.text()).then(async req => {
        req = $(req);
        if (!isNaN(user)) {
            userId = user;
            username = req.find('.member_username').text().trim();
        } else {
            userId = req.find('#usermenu>li>a').attr('href').split('u=')[1];
            username = user;
        }
        userClass = req.find('.member_username span').attr('class') ? req.find('.member_username span').attr('class').replace('usermarkup', 'niv') : '';
        userStyle = req.find('.member_username').children().eq(0).attr('style') ? req.find('.member_username').children().eq(0).attr('style').replace('color:#000000', '') : '';
        tatnick = req.find('.usertitle').text().trim() !== '' ? req.find('.usertitle').text().trim().replaceAll(/"/g, "\u201d") : (await getTat(userClass, req.find('.usertitle img'))).replaceAll(/"/g, "\u201d");
        tatnickfont = req.find('.usertitle').children('span').css('font-family') ? req.find('.usertitle').children('span').css('font-family').replaceAll('"', "") : 'var(--fxp-font-family)';

        return {
            userId,
            username: decodeURI(username),
            tatnick,
            tatnickfont,
            userClass,
            userStyle
        };
    });
}

// function for my nick in navbar
function login6() {
    console.log('login6 run');
    if ($('.log_in6 > a').length == 0) return;
    let userId = $('.log_in6 > a').attr('href').split('u=')[1];

    getUser(userId).then(data => {
        let {
            username,
            tatnick,
            tatnickfont,
            userClass,
            userStyle
        } = data;

        $('.log_in6').html(userA(username, tatnick, tatnickfont, userClass, userStyle, userId));
    });
}

// /posthistory.php function
function posthistory() {
    let users = new Set();
    let elements = $('.usernamecol');

    elements.each(function (index, nick) {
        let user = $(this).text();
        users.add(user);
    });

    let teamM = [];

    fetch(`/${forumname}/`).then(x => x.text()).then(req => {
        let team = $(req).find('.teammen.flo .username');

        team.each(function () {
            teamM.push($(this).attr('href').split('u=')[1]);
        });

        [...users].forEach(user => {
            getUser(user).then(data => {
                let {
                    userId,
                    username,
                    tatnick,
                    tatnickfont,
                    userClass,
                    userStyle
                } = data;

                let el = elements.filter(function () {
                    return $(this).text().includes(userId);
                });

                el.html(userA(username, tatnick, tatnickfont, userClass, userStyle, userId, teamM.includes(userId)));
            });
        });
    });
}

// /search.php function
function search() {
    let users = new Set();
    let elements = $(".username.understate, .threadlastpost.td>dd:first-child>a, .username_container>a, .deletedby a");

    elements.each(function (index, nick) {
        let user = nick.href.split('u=')[1] ? nick.href.split('u=')[1] : nick.href.split('username=')[1];
        users.add(user);
    });

    [...users].forEach(user => {
        getUser(user).then(data => {
            let {
                userId,
                username,
                tatnick,
                tatnickfont,
                userClass,
                userStyle
            } = data;

            let el = elements.filter(`[href$='=${userId}'], [href$='=${username}']`);
            el.html(userA(username, tatnick, tatnickfont, userClass, userStyle, userId));
        });
    });
}

// /forumdisplay.php function
function forumdisplay() {
    let users = new Set();
    let elements = $(".username.understate, .username.online.popupctrl, .username.offline.popupctrl, .username.invisible.popupctrl, .deletedby a");

    let team = $('.teammen.flo .username, .flo .username');
    let teamM = [];
    team.each(function () {
        teamM.push($(this).text().trim());
    });

    let mergeel = $.merge(elements, team);

    mergeel.each(function (index, nick) {
        let user = nick.href.split('u=')[1] ? nick.href.split('u=')[1] : nick.href.split('username=')[1];
        users.add(user);
    });

    [...users].forEach(user => {
        getUser(user).then(data => {
            let {
                userId,
                username,
                tatnick,
                tatnickfont,
                userClass,
                userStyle
            } = data;

            let el = mergeel.filter(`[href$='=${userId}'], [href$='=${username}']`);
            el.map((i, mel) => {
                $(mel).html(userA(username, tatnick, tatnickfont, userClass, userStyle, userId, (teamM.includes(username) && !team.is(mel))));
            });
        });
    });
}

// function that make tmiha tat nicks to white
function tomehTat() {
    let tat = $('.usertitle.balloonNoBorder > a > span, .usertitle.balloonNoBorder > span');
    //console.log(tat.css('color'));
    tat.filter((i, t) => $(t).css("color") === 'rgb(0, 0, 0)').css("color", '#fff');
}

$('head').append('<link rel="stylesheet" type="text/css" href="https://scripts.remixn.xyz/TatNicks.css?v=47">');
$('head').append('<link rel="stylesheet" type="text/css" href="https://scripts.remixn.xyz/Balloon.css?v=43">');
$('head').append('<script src="https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js"></script>');


switch (location.pathname) {
    case "/posthistory.php": posthistory();
        break;
    case "/search.php": search();
        break;
    case "/showthread.php":
    case "/member.php": tomehTat();
        break;
    case "/forumdisplay.php":
        forumdisplay();
        $(document).ready(function () {
            if (forumname !== categoryname) {
                var observer = new MutationObserver(function (e) {
                    forumdisplay();
                });
                if ($('.threads').length > 0) {
                    observer.observe($('.threads')[0], {
                        characterData: true,
                        childList: true
                    });
                }
            }
        });
        break;
}
login6();

$("#bottomfxplusplusstats").prepend(`<div>המכחול של ניב @ ${GM_info.script.version}</div>`);