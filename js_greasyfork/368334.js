// ==UserScript==
// @name         Bilibili Live Helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http*://live.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368334/Bilibili%20Live%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/368334/Bilibili%20Live%20Helper.meta.js
// ==/UserScript==

(function() {
    const keywords = ['小电视飞船']

    if (window.type === 'lottery') {
        console.log('child');
        childMain();
    } else if (location.href.match(/^https?:\/\/live.bilibili.com\/\d+$/)) {
        console.log('parent');
        parentMain();
        //awardMain();
        //refreshRedBag();
    }

    function childMain() {
        setInterval(() => {
            $('button[data-title="静音"]').click();
            $('.lottery-box .main').click();
            if ($('.lottery-box .title').text().indexOf('已抽奖') !== -1) {
                window.close();
            }
            $('.lottery-notice-cntr').find('span').each(function () {
                if ($(this).text() === '查看我的奖品') {
                    $('.ignore-notice input').click();
                    $(this).click();
                }
            });
            $('.gift-result-cntr').find('span').each(function () {
                if ($(this).text() === '确认') {
                    $(this).click();
                }
            });
            if ($('.supporting-text').text().indexOf('这个房间不存在') !== -1) {
                window.close();
            }
        }, 500);

        setTimeout(() => {
            window.close();
        }, 30000);
    }

    function parentMain() {
        window.silverEnd = false;
        let handler = () => {
            //console.log('check');
            getLottery();
            //getSilver();
        };

        register('自动抽奖', handler, 10000, true);
    }

    function awardMain() {
        const award_name = '红灯笼';
        const award_id = 'gift-109';
        const price = 15;
        const maxCount = 53;

        let stop = () => {};
        let handler = () => {
            let minutes = new Date().getMinutes();
            if (minutes !== 59 && minutes !== 0) {
                return;
            }
            let balance = $('.bag-num').text();
            post('/activity/v1/NewSpring/redBagExchange', {award_id: award_id, exchange_num: Math.min(Math.floor(balance / price), maxCount)}).then(result => {
                console.log(result);
                if (result.code >= 0) {
                    stop();
                }
            });
            /*get('/activity/v1/NewSpring/redBagPool?_=' + (+new Date())).then(json => {
                let awards = json.data.pool_list.filter(award => award.award_name === award_name && award.price <= price);
                let balance = json.data.red_bag_num;
                if (awards.length > 0) {
                    let award = awards[0];
                    let amount = Math.min(award.user_exchange_count, award.stock_num, Math.floor(balance / award.price));
                    if (amount > 0) {
                        post('/activity/v1/NewSpring/redBagExchange', {award_id: award.award_id, exchange_num: amount}).then(result => {
                            console.log(result);
                            stop();
                        });
                    }
                }
            });*/
        };

        stop = register('自动兑换' + award_name, handler, 100, false);
    }

    function refreshRedBag() {
        let handler = () => {
            get('/activity/v1/NewSpring/getRedBagNum?_=' + (+new Date())).then(json => {
                let balance = json.data.red_bag_num;
                $('.bag-num').text(balance);
            });
        };

        setInterval(handler, 60000);
    }

    function register(text, handler, interval, on) {
        let key = Math.floor(Math.random() * 100000);

        window['start_' + key] = () => {
            let intervalId = setInterval(handler, interval);
            $(`.my-btn-${key} input[type="checkbox"]`).prop("checked", true);
            window['stop_' + key] = () => {
                clearInterval(intervalId);
                $(`.my-btn-${key} input[type="checkbox"]`).prop("checked", false);
            };
        };

        if (on) {
            window['start_' + key]();
        }

        setTimeout(() => {
            $('.seeds-wrap').prepend(`
                <div data-v-06a3a440="" class="item my-btn-${key}">
                    <span style="vertical-align: middle;">${text}</span>
                    <input type="checkbox" ${on ? 'checked="checked"' : ''} style="vertical-align: middle; margin-left: 3px;" onclick="event.target.checked ? start_${key}() : stop_${key}()"/>
                </div>
            `);
        }, 2000);

        return () => window['stop_' + key]();
    }

    function getLottery() {
        let set = new Set();
        $('.chat-history-list').find('a').filter((index, elem) => {
            let text = $(elem).text();
            return keywords.some(k => text.indexOf(k) !== -1) && text.indexOf('（已领取）') === -1;
        }).each((index, elem) => {
            let link = $(elem);
            let text = link.text();
            link.text(text + '（已领取）');
            let url = link.attr('href');
            set.add(url.replace('http:', location.protocol));
        });

        promiseTimeout(2000).then(() => {
            if (set.size > 0) {
                history.pushState({}, '', '404'); // 修改referer至3-4位短号
                promiseTimeout(2000).then(() => history.back());
            }

            set.forEach(item => {
                let match = /\d+/.exec(item);
                if (match) {
                    let roomId = match[0];
                    get(`/room/v1/Room/room_init?id=${roomId}`).then(json => {
                        roomId = json.data.room_id;
                        return Promise.all([
                            get(`/activity/v1/Raffle/check?roomid=${roomId}`),
                            get(`/gift/v2/smalltv/check?roomid=${roomId}`),
                            promiseTimeout(1000)
                        ]);
                    }).then(([json1, json2]) => {
                        json1.data.forEach(raffle => {
                            get(`/activity/v1/Raffle/join?roomid=${roomId}&raffleId=${raffle.raffleId}`).then(result => {
                                console.log(result);
                            });
                        });
                        if (json2.data instanceof Array) {
                            json2.data.forEach(raffle => {
                                get(`/gift/v2/smalltv/join?roomid=${roomId}&raffleId=${raffle.raffleId}`).then(result => {
                                    console.log(result);
                                });
                            });
                        }
                    });
                }
                // let newWindow = window.open(item + '#lottery', '_blank');
                // newWindow.type = 'lottery';
            });
        });
    }

    function getSilver() {
        if ($('.count-down').text() === '00:00' && !window.silverEnd) {
            if (!$('.awarding-panel').is(':visible')) {
                $('.box-icon').click();
            }

            promiseTimeout(500).then(() => {
                if ($('.awarding-panel div').filter((index, elem) => $(elem).text().indexOf('木有') !== -1).length > 0) {
                    window.silverEnd = true;
                    $('.treasure-box .close-btn').click();
                    throw null;
                }
                var img = $('.captcha-img')[0];
                if (!img) {
                    $('.treasure-box .close-btn').click();
                    throw null;
                }
                return getImageData(img);
            }).then((imgData) => {
                return recognize(imgData);
            }).then((text) => {
                console.log(text);

                var answer;
                try {
                    answer = eval(text);
                } catch (err) {
                    answer = 'error';
                }

                console.log(answer);
                var $input = $('.captcha-widget .link-input');
                setInputValue($input, answer);
                $('.submit-btn').find('button').click();
            });
        }
    }

    function getImageData(img) {
        return new Promise((resolve, reject) => {
            var dom = document.createElement('img');
            dom.setAttribute('crossorigin', 'use-credentials');
            dom.src = img.src;
            dom.setAttribute('style', 'display: none');
            document.body.appendChild(dom);

            setTimeout(() => {
                var canvas = document.createElement('canvas');
                var context = canvas.getContext('2d');
                var img = dom;
                canvas.width = Math.floor(img.width / 2);
                canvas.height = img.height;
                context.drawImage(img, 0, 0, canvas.width, canvas.height);
                var myData = context.getImageData(0, 0, canvas.width, canvas.height);
                document.body.removeChild(dom);
                resolve(myData);
            }, 500);
        });
    }

    function setInputValue($input, value) {
        $input.val(value.toString());
        triggerEvent($input[0], 'input');
    }

    function recognize(imgData) {
        let res = extract(threshold(imgData)).map(features => recognizeItem(features)).join('');
        return Promise.resolve(res);
    }

    function recognizeItem(features) {
        let res = null;
        let min = Number.MAX_VALUE;
        Object.keys(ref).forEach(chr => {
            let dis = distance(normalize(ref[chr]), normalize(features));
            if (dis < min) {
                res = chr;
                min = dis;
            }
        });
        return res;
    }

    function threshold(imgData) {
        return {
            data: imgData.data.filter((value, index) => index % 4 === 0).map(value => value < 128 ? 1 : 0),
            width: imgData.width,
            height: imgData.height
        };
    }

    function extract(bwImgData) {
        let res = [];
        for (let i = 0; i < bwImgData.width; i++) {
            let projection = [];
            let value = 0;
            while ((value = range(bwImgData.height).filter(j => bwImgData.data[i + bwImgData.width * j]).length)) {
                projection.push(value);
                i++;
            }
            if (projection.length > 0) {
                res.push(projection);
            }
        }
        return res;
    }

    let ref = {
        '1': [7, 31, 31],
        '2': [16, 19, 16, 16, 16, 21, 18],
        '3': [20, 20, 8, 11, 15, 31, 28],
        '4': [5, 11, 17, 18, 14, 24, 19, 4],
        '5': [25, 25, 12, 12, 12, 24, 24],
        '6': [31, 31, 12, 12, 12, 27, 27],
        '7': [8, 8, 11, 19, 23, 19, 11],
        '8': [28, 31, 14, 12, 14, 31, 28],
        '9': [27, 27, 12, 12, 12, 31, 31],
        '-': [4, 4, 4, 4],
        '+': [4, 4, 4, 16, 16, 4, 4, 4]
    };

    function normalize(array) {
        let half = Math.ceil(array.length / 2);
        let length = half * 2;
        let res = Array(8).fill(0);
        for (let i = 0; i < half; i++) {
            res[i] = array[i];
            res[length - 1 - i] = array[array.length - 1 - i];
        }
        return res;
    }

    function distance(a, b) {
        let res = 0;
        for (let i = 0; i < a.length; i++) {
            res += (a[i] - b[i]) * (a[i] - b[i]);
        }
        return Math.sqrt(res);
    }

    function range(n) {
        return [...Array(n).keys()];
    }

    function triggerEvent(element, eventName) {
        var event;

        if (document.createEvent) {
            event = document.createEvent("HTMLEvents");
            event.initEvent(eventName, true, true);
        } else {
            event = document.createEventObject();
            event.eventType = eventName;
        }

        event.eventName = eventName;

        if (document.createEvent) {
            element.dispatchEvent(event);
        } else {
            element.fireEvent("on" + event.eventType, event);
        }
    }

    function promiseTimeout(time) {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, time);
        });
    }

    const urlPrefix = location.protocol + '//api.live.bilibili.com';

    function get(url, headers) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: urlPrefix + url,
                xhrFields: {
                    withCredentials: true
                },
                headers: headers
            }).done(data => {
                resolve(data);
            }).fail((xhr, text, error) => {
                reject(text + (error ? ': ' + error : ''));
            });
        });
    }

    function post(url, data, headers) {
        return new Promise((resolve, reject) => {
            $.ajax({
                method: 'POST',
                url: urlPrefix + url,
                data: data,
                xhrFields: {
                    withCredentials: true
                },
                headers: headers
            }).done(data => {
                resolve(data);
            }).fail((xhr, text, error) => {
                reject(text + (error ? ': ' + error : ''));
            });
        });
    }
})();