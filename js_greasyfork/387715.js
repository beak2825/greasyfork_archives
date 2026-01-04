// ==UserScript==
// @name         Checkin
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  签到
// @author       You
// @match        https://newtab.firefoxchina.cn/newtab/as/activity-stream.html
// @match        https://www.manhuabudang.com/u.php*
// @match        https://www.abooky.com/plugin.php?id=k_misign:sign*
// @match        https://bbs.naxgen.cn/plugin.php?id=dc_signin:sign*
// @match        https://bbs.mihoyo.com/bh3/
// @match        https://www.galcg.com/mission/today
// @match        https://www.gamersky.com/
// @match        http://psnine.com*
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/387715/Checkin.user.js
// @updateURL https://update.greasyfork.org/scripts/387715/Checkin.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var indexurl = 'https://www.gamersky.com/';

    var tag = '#Checkin';
    var nowdate = new Date().toLocaleDateString();
    function galcgdo() {
        const colsebutton = $('.gg-box .close-button');
        if (colsebutton)
            colsebutton[0].click();

    }

    var urllist = [
        { name: 'abooky', url: 'https://www.abooky.com/plugin.php?id=k_misign:sign', do: null, oksign: '#JD_sign', nosign: '.card_old' },
        { name: 'manhuabudang', url: 'https://www.manhuabudang.com/u.php', do: null, oksign: '#punch', nosign: '.btnvisted' },
        { name: 'd7vg', url: 'http://psnine.com/', do: null, oksign: '.yuan', nosign: null },
        { name: '91wii', url: 'https://bbs.naxgen.cn/plugin.php?id=dc_signin:sign', do: do91wii, oksign: '.pnc', nosign: null },
        // { name: 'mihoyo', nocheck: true, url: 'https://bbs.mihoyo.com/bh3/', do: null, oksign: '.header__signin', nosign: null },
        { name: 'galcg', nocheck: true, url: 'https://www.galcg.com/mission/today', do: galcgdo, oksign: "button:contains('立刻签到')", nosign: null }


    ];

    function do91wii() {
        $('.dcsignin_list > li:nth-child(1)').click();
    }

    function createlink(obj) {
        var content = document.createElement("a");
        content.href = obj.url + tag;
        content.target = '_blank';
        document.body.appendChild(content);
        content.click();
    }

    function setdate(obj) {
        let name = obj.name + tag;
        let setting = GM_getValue(name);
        setting.date.push(nowdate);
        GM_setValue(name, setting);
    }

    function clicklink(obj) {
        console.log(location.href);

        if (location.href == 'https://bbs.mihoyo.com/bh3/') {
            var t = setInterval(function () {
                var button = $('.header__signin');
                if (button) {
                    button[0].click();
                    clearInterval(t);
                }

            }, 2000)
        }



        if (!obj.nocheck) {
            if (!location.hash || location.hash != tag) {
                console.log('no hash');
                return;
            }
            if (location.href != obj.url + tag) {
                console.log('no href');
                return;
            }
        } else {
            if (location.href != obj.url) {
                console.log('no url');
                return;
            }
        }

        if (obj.do) obj.do();


        console.log('clicklink run');
        var button = $(obj.oksign);
        console.log(button);
        if (button) {
            if (obj.do) obj.do();
            setTimeout(function () {
                button.click();
                setdate(obj);
                console.log('签到完成');
                setTimeout(function () { window.close(); }, 2000);

            }, 2000);


        }
        else {
            if (obj.nosign) {
                button = $(obj.nosign);
                if (button) {
                    setdate(obj);
                    console.log('签到完成');
                    setTimeout(function () { window.close(); }, 2000);
                }
                else

                    alert('签到错误');
            }
        }

    }

    function getsetting(obj) {
        let name = obj.name + tag;
        let setting = GM_getValue(name);
        if (!setting) {
            setting = { name: name, date: [] };
            GM_setValue(name, setting);
        }
        return setting;
    }


    function run() {
        if (location.href == indexurl) {
            urllist.forEach(e => {
                let setting = getsetting(e);
                let num = setting.date.find(e => e == nowdate);
                console.log(setting);
                console.log(num);
                if (!num || num.length == 0) {
                    createlink(e);
                }
            });
        } else {
            urllist.forEach((e) => clicklink(e));
        }
    }

    run();
})();