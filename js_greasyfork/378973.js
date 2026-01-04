// ==UserScript==
// @name         哔哩哔哩点赞机器
// @version      1.3
// @description  自动点击哔哩哔哩视频评论区的点赞按钮
// @author       zjlian
// @include      *://*.bilibili.com/video*
// @require      https://cdn.bootcss.com/rxjs/6.4.0/rxjs.umd.min.js
// @require      https://cdn.bootcss.com/store.js/1.3.20/store.min.js
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @namespace https://greasyfork.org/users/251759
// @downloadURL https://update.greasyfork.org/scripts/378973/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%82%B9%E8%B5%9E%E6%9C%BA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/378973/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%82%B9%E8%B5%9E%E6%9C%BA%E5%99%A8.meta.js
// ==/UserScript==
const DEBUG = false;
const getEl = document.querySelectorAll.bind(document);
const LOG = (...args) => DEBUG ? window.console.log(args) : null;
let config = {
    likeButtonClassName: '.ops>span.like .info>span.like .dynamic-like',
    activeLikeButtonClassName: 'liked on',
    delayTime: 400,
    loopDelayTime: 35*1000,
};

function __() {
    const infoDisplay = $('.item.help');
    const status = store.get('LIKE_MACHINE_SWITCH');
    const btn = $(`<span title="${status ? '启动' : '关闭'}" class="like ${status ? 'on' : ''}">
        <i class="van-icon-videodetails_like" style="color:;"></i>自动点赞</span>`);
    btn.on('click', () => {
        store.set('LIKE_MACHINE_SWITCH', !store.get('LIKE_MACHINE_SWITCH'));
        btn.toggleClass('on');
    });

    rxjs.timer(6000).subscribe(_ => $('.share').after(btn));

    infoDisplay.css('height', 'auto');
    rxjs.timer(16, 200).subscribe(_ => {
        infoDisplay.removeClass('help');
        const info = {
            RUNNING: store.get('RUNNING'),
            NEXT_TIME: store.get('NEXT_TIME'),
            WORKING_PAGE: store.get('WORKING_PAGE')
        }
        if(info.RUNNING) {
            if(info.WORKING_PAGE === `av${aid}`) {
                infoDisplay.html(`<span>当前页<br>点赞中</span>`);
            } else {
                infoDisplay.html(`<span>${info.WORKING_PAGE}<br>点赞中</span>`);
            }
        } else {
            if(fvck.size === 0) {
                infoDisplay.html(`<span>当前页<br>已完成</span>`);
            } else {
                const s = ((info.NEXT_TIME - +new Date()) / 1000).toFixed(1);
                infoDisplay.html(`<span>冷却中<br>${s < 0 ? 0 : s}s</span>`);
            }

        }
    });

    // 记录当前打开的页面数量，当打开页面数量小于等于0时，释放点赞权
    const WORKING_PAGES = store.get('WORKING_PAGE_COUNT') ? store.get('WORKING_PAGE_COUNT') : 0;
    store.set('WORKING_PAGE_COUNT', WORKING_PAGES + 1);
    $(window).bind('beforeunload', _ => {
        store.set('WORKING_PAGE_COUNT', store.get('WORKING_PAGE_COUNT') - 1);
        if(store.get('WORKING_PAGE_COUNT') <= 0) {
            store.set('RUNNING', false);
        }
    });
}

(function() {
    'use strict';
    __();
    const { fromEvent, timer, of, pipe, from } = rxjs;
    const { filter, map, delay, concatMap, debounceTime, take } = rxjs.operators;
    window.fvck = new Set();
    const shit$ = fromEvent(document, 'scroll').pipe(debounceTime(500));
    let init = false;

    const collector = () => {
        if(!store.get('LIKE_MACHINE_SWITCH')) { return; }
        const btnList = [];
        config.likeButtonClassName
        .split(' ')
        .forEach(c => btnList.push(...getEl(c)));

        from([...btnList, ...fvck])
        .pipe(
            map(item => {
                if(item.className.match(/liked|on/) !== null) {
                    fvck.delete(item);
                }
                return item;
            }),
            filter(item => item.className.match(/liked|on/) === null),
        )
        .subscribe(
            item => fvck.add(item),
            () => LOG('点赞机发生未知错误'),
            () => {
                if(!init && fvck.size > 0) {
                    LOG('启动！！！！！！！！！！！');
                    run();
                    init = true;
                }
            }
        );
        LOG(`剩余 ${fvck.size} 条未点赞评论，${store.get('NEXT_TIME') >= +new Date() ? '下一波' + (store.get('NEXT_TIME') - +new Date()) / 1000 + 's 后开始' : '正在点赞中'}`);
    };
    const run = () => {
        timer(1000, 600).subscribe(() => {
            const NEXT_TIME = store.get('NEXT_TIME') ? store.get('NEXT_TIME') : 0;
            if(fvck.size === 0 || (+new Date() <= NEXT_TIME) || store.get('RUNNING')) {
                return;
            }
            store.set('RUNNING', true);
            store.set('WORKING_PAGE', `av${aid}`);
            LOG(`${store.get('WORKING_PAGE')} 开始点赞`);

            const what = from([...fvck])
            .pipe(
                take(14),
                filter(item => item.className.match(/liked|on/) === null),
                concatMap(item => {
                    return of(item).pipe(delay(config.delayTime));
                }),
            )
            .pipe(
                map(item => {
                    item.click();
                    LOG('点');
                })
            )
            what.subscribe(null, null, () => {
                LOG(`点赞完成，35秒后进行下一轮点赞`);
                store.set('NEXT_TIME', +new Date() + config.loopDelayTime);
                store.set('RUNNING', false);
            });
        });
    };
    shit$.subscribe(collector);
})();
