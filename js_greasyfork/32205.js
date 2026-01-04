function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// ==UserScript==
// @name         Steamcn 7L Optimisation
// @namespace    http://tampermonkey.net/
// @version      2.1.0
// @description  try to take over the world!
// @icon         https://steamcn.com/favicon-hq.ico
// @author       Bisumaruko
// @include      https://steamcn.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document_start
// @downloadURL https://update.greasyfork.org/scripts/32205/Steamcn%207L%20Optimisation.user.js
// @updateURL https://update.greasyfork.org/scripts/32205/Steamcn%207L%20Optimisation.meta.js
// ==/UserScript==

/* global swal, Fuse, validate_7l */

const URL7LTop = 'https://steamcn.com/plugin.php?id=steamcn_gift:7l';
const URL7LCreate = 'https://steamcn.com/forum.php?mod=post&action=newthread&fid=298&specialextra=steamcn_gift';
const URL7LList = 'https://steamcn.com/plugin.php?id=steamcn_gift:chosen&type=';
const fetchTimer = 3 * 24 * 60 * 60 * 1000; // fetch game list every 3 days

const has = Object.prototype.hasOwnProperty;
const inject = (arg, onload = null) => {
    if (Array.isArray(arg)) arg.forEach(inject);else if (typeof arg === 'string') inject({ url: arg, onload });else if (arg instanceof Object) {
        let tag = null;

        if (has.call(arg, 'url')) {
            if (arg.url.endsWith('.js')) {
                tag = document.createElement('script');
                tag.src = arg.url;
                if (typeof arg.onload === 'function') tag.onload = arg.onload;
            } else if (arg.url.endsWith('.css')) {
                tag = document.createElement('link');
                tag.href = arg.url;
                tag.rel = 'stylesheet';
                tag.type = 'text/css';
            }
        } else if (has.call(arg, 'css')) {
            tag = document.createElement('style');
            tag.type = 'text/css';
            tag.appendChild(document.createTextNode(arg.css));
        }

        if (tag !== null) document.head.appendChild(tag);
    }
};

const timezones = {
    'GMT-12': '',
    'GMT-11': 'Pacific/Midway',
    'GMT-10': 'Pacific/Honolulu',
    'GMT-9': 'America/Anchorage',
    'GMT-8': 'America/Los_Angeles',
    'GMT-7': 'America/Phoenix',
    'GMT-6': 'America/Chicago',
    'GMT-5': 'America/New_York',
    'GMT-4': 'America/Halifax',
    'GMT-3.5': 'America/St_Johns',
    'GMT-3': 'America/Sao_Paulo',
    'GMT-2': 'Atlantic/South_Georgia',
    'GMT-1': 'Atlantic/Cape_Verde',
    GMT: 'Europe/London',
    'GMT+1': 'Europe/Berlin',
    'GMT+2': 'Europe/Kiev',
    'GMT+3': 'Europe/Moscow',
    'GMT+3.5': 'Asia/Tehran',
    'GMT+4': 'Asia/Dubai',
    'GMT+4.5': 'Asia/Kabul',
    'GMT+5': 'Asia/Karachi',
    'GMT+5.5': 'Asia/Colombo',
    'GMT+5.75': 'Asia/Kathmandu',
    'GMT+6': 'Asia/Urumqi',
    'GMT+6.5': 'Asia/Yangon',
    'GMT+7': 'Asia/Bangkok',
    'GMT+8': 'Asia/Taipei',
    'GMT+9': 'Asia/Tokyo',
    'GMT+9.5': 'Australia/Adelaide',
    'GMT+10': 'Australia/Sydney',
    'GMT+11': 'Asia/Magadan',
    'GMT+12': 'Pacific/Auckland'
};
const games = {
    data: JSON.parse(GM_getValue('steamCN7L_games') || '{}'),
    set(value) {
        if (value instanceof Object) this.data = value;

        GM_setValue('steamCN7L_games', JSON.stringify(this.data));
    },
    get(key) {
        return has.call(this.data, key) ? this.data[key] : null;
    },
    fetch() {
        var _this = this;

        return _asyncToGenerator(function* () {
            const res = yield fetch(`${URL7LList}steam`, {
                method: 'GET',
                headers: {
                    accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                    'upgrade-insecure-requests': 1
                },
                credentials: 'same-origin'
            });

            if (res.ok) {
                const list = [];
                const options = yield res.text();
                const regExpGame = /value=.+?(\d+)+.+?>(.+?)(?=<\/option>)/g;
                let match;

                // parse game list
                while (match = regExpGame.exec(options)) {
                    if (match.length === 3) {
                        list.push({
                            game: match[2].replace(/^【.+?】/, '').replace(/\(([^)]*)\)[^(]*$/, '').trim(),
                            text: match[2].trim(),
                            value: match[1]
                        });
                    }
                }

                _this.set({
                    list,
                    lastFetched: Date.now()
                });

                if (swal.isVisible()) {
                    swal({
                        text: 'Finished loading',
                        type: 'success'
                    });
                }
            }
        })();
    }
};
const handler = () => {
    const $ = jQuery;
    let fuse = {};
    let searchTimer = null;
    // inject css
    inject({
        css: `
            [class*="7LOptimise"] #ga_id { display: none !important; }
            [class*="7LOptimise"] [class="7LSearchBox"] { display: block !important; }
            [class="7LSearchBox"] {
                width: 500px;
                height: 27px;
                display: none;
                padding-left: 5px;
                border: 1px solid;
                border-color: #E4E4E4 #E0E0E0 #E0E0E0 #E4E4E4;
                box-sizing: border-box;
            }
            [class="7LSearchResult"] {
                width: 500px;
                height: 100px;
                display: none;
                position: absolute;
                padding: 5px;
                overflow: auto;
                overflow-x: hidden;
                background-color: white;
                box-sizing: border-box;
            }
            [class="7LSearchResult"] > span {
                width: 100%;
                display: inline-block;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                border: 1px solid white;
                cursor: pointer;
            }
            [class="7LSearchResult"] > span:hover { border-color: #57bae8; }
        `
    });

    // initialise
    const $body = $('body');
    const $gaID = $('#ga_id');
    const $gaType = $('#ga_type');
    const searchBox = $('<input/>', {
        type: 'text',
        class: '7LSearchBox',
        placeholder: '选择要赠出的礼物（点击输入名称过滤）'
    });
    const searchResult = $('<div/>', {
        class: '7LSearchResult',
        text: 'Searching...'
    });
    const timezone = $('.subforunm_foot_intro_right > div:last-child').text().split(',')[0].trim();

    // override original change event on gaType
    $gaType.off('change').change(_asyncToGenerator(function* () {
        const type = $gaType.val();

        $gaID.empty();

        if (type === 'steam') $body.addClass('7LOptimise');else {
            const res = yield fetch(URL7LList + type);

            if (res.ok) {
                const data = yield res.text();

                $gaID.append(data);
                $body.removeClass('7LOptimise');
            } else swal('Oops', 'Loading failed', 'error');
        }
    }));

    // insert search box replacement
    $gaID.after(searchBox, searchResult);
    $body.addClass('7LOptimise');

    // initialise fuse
    fuse = new Fuse(games.get('list'), {
        shouldSort: true,
        includeScore: true,
        threshold: 0.1,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        keys: ['game']
    });

    // bind event to search box
    searchBox.keyup(e => {
        const $ele = $(e.delegateTarget);
        const input = $ele.val().slice(0, 100);

        if (input.length > 0) {
            searchResult.css('display', 'block');
            searchBox.focus(() => {
                searchResult.css('display', 'block');
            });

            // only perform search if 0.3 second has passed
            clearTimeout(searchTimer);
            searchTimer = setTimeout(() => {
                const results = fuse.search(input);
                let i = 0;

                searchResult.empty();

                if (results.length > 0) {
                    while (i < 30) {
                        const result = results[i];

                        if (!result) break;

                        searchResult.append($(`<span>${result.item.text}</span>`).click(() => {
                            searchBox.val(result.item.text);
                            $gaID.empty().append(`<option selected value=${result.item.value}></option>`);
                            $('#subject').val(`[${$('#ga_type > option:selected').text()}] ${result.item.game}`);
                        }));

                        // if (result.score === 0) break; // perfect match
                        i += 1;
                    }
                }
            }, 300);
        }
    });

    // hide searchResult when click
    $body.click(e => {
        if (!$(e.target).hasClass('7LSearchBox')) searchResult.css('display', 'none');
    });

    // change copy & giveRate field type
    $('#ga_copy, #ga_ratio').attr({
        type: 'number',
        min: 1
    }).css({
        width: '54px',
        'background-color': 'white'
    });

    // override default date time picker
    $('#ga_start, #ga_end').removeAttr('onclick').datetimepicker({
        dateFormat: 'yy-mm-dd'
    });

    // override quick start & end event
    $('.quicksetstart, .quicksetend').off().click(e => {
        const $ele = $(e.delegateTarget);
        const type = $ele.attr('class').split('set').pop();
        const hour = $ele.attr('data-hour') || 0;
        let base = Date.now();

        if ($ele.hasClass('quicksetend')) {
            const startTime = new Date($('#ga_start').val()).getTime();

            if (startTime) base = startTime; // change base to start time if quicksetend
        }

        $(`#ga_${type}`).val(new Date(base + hour * 60 * 60 * 1000).toLocaleDateString('zh', {
            hour12: false,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).replace(/\//g, '-'));
    });

    // offset timezone before submit
    const form = $('#postform');

    form.removeAttr('onsubmit').submit(e => {
        e.preventDefault();

        $('#ga_start, #ga_end').each((index, element) => {
            const $ele = $(element);

            $ele.val(new Date($ele.val()).toLocaleDateString('zh', {
                timeZone: timezones[timezone] || 'Asia/Taipei',
                hour12: false,
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            }).replace(/\//g, '-'));
        });

        validate_7l(form[0]);
    });
};

// update games list
if (!games.get('lastFetched') || games.get('lastFetched') < Date.now() - fetchTimer) games.fetch();

// inject swal
inject(['https://cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/7.26.11/sweetalert2.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/7.26.11/sweetalert2.min.css']);

document.addEventListener('click', (() => {
    var _ref2 = _asyncToGenerator(function* (e) {
        if (e.target.id === 'd_gw_nav_newgw') {
            swal('Loading');
            swal.showLoading();

            const res = yield fetch(URL7LCreate, {
                method: 'GET',
                headers: {
                    accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                    'upgrade-insecure-requests': 1
                },
                credentials: 'same-origin'
            });

            if (res.ok) {
                let html = yield res.text();

                // remove chosen.js & chosen.css
                html = html.replace(/<script.+?chosen.+?\.js.+?<\/script>/, '');
                html = html.replace(/<link.+?chosen\.min\.css.+?>/, '');

                // trim the inline script initialising chosen
                html = html.split('jQuery(\'#postform\').attr');
                html[1] = html[1].slice(html[1].indexOf('var serverTime'), html[1].indexOf('function formatedTimeAfter')) + html[1].slice(html[1].indexOf('</script>'));
                html = html.join('');

                // inject script & css
                html = html.split('</head>');
                html[0] += `
                <script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-ui-timepicker-addon/1.6.3/jquery-ui-timepicker-addon.min.js"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-ui-timepicker-addon/1.6.3/jquery-ui-sliderAccess.js"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/fuse.js/3.0.5/fuse.min.js"></script>
                <link href="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.css" rel="stylesheet" type="text/css">
                <link href="https://cdnjs.cloudflare.com/ajax/libs/jquery-ui-timepicker-addon/1.6.3/jquery-ui-timepicker-addon.min.css" rel="stylesheet" type="text/css">
            `;
                html = html.join('</head>');

                document.open('text/html');
                document.write(html);
                document.close();

                window.history.pushState({}, '', URL7LCreate);
                window.addEventListener('popstate', function (f) {
                    if (f.state === null) location.href = URL7LTop;
                });

                (function loaded() {
                    if (document.querySelector('#ga_id')) handler();else setTimeout(loaded, 10);
                })();
            } else swal('Oops', 'Loading failed', 'error');
        }
    });

    return function (_x) {
        return _ref2.apply(this, arguments);
    };
})());
document.addEventListener('DOMContentLoaded', () => {
    // remvoe create 7l anchor tag href
    const create7lLink = document.querySelector('#d_gw_nav_newgw');

    if (create7lLink) create7lLink.parentNode.removeAttribute('href');

    // insert manual update gme list button
    const anchor = document.querySelector('#d_gw_detail.d_gw_detail_hoverable');

    if (anchor && (location.pathname.startsWith('/steamcn_gift-7l.html') || location.href.includes('id=steamcn_gift'))) {
        inject({
            css: `
                div[class*="7LFetch"] {
                    margin-bottom: 20px;
                }
            `
        });

        const block = document.createElement('div');
        let lastFetched = 'No Data';

        if (games.get('lastFetched')) {
            const timeElapsed = Date.now() - games.get('lastFetched');
            const hoursElapsed = Math.round(timeElapsed / 1000 / 60 / 60);
            const daysElapsed = Math.round(hoursElapsed / 24);

            lastFetched = daysElapsed > 0 ? `${daysElapsed}天${hoursElapsed - daysElapsed * 24}小時前` : `${hoursElapsed}小時前`;
        }

        block.className = '7LFetch';
        block.innerHTML = `
            <button>手動更新遊戲列表</button>
            <span>上次更新：${lastFetched}</span>
        `;

        block.querySelector('button').addEventListener('click', () => {
            swal('Loading');
            swal.showLoading();
            games.fetch();
        });

        anchor.before(block);
    }
});