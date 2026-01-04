// ==UserScript==
// @name                  Картинки юнитов ГЛ в конце боя
// @version               0.1.2
// @description           Отображение картинок юнитов ГЛ, которые получены за бой
// @author                isnt
// @include               /^https:\/\/((www|qrator|my)(\.heroeswm\.ru|\.lordswm\.com))\/war.php/
// @grant                 GM_setValue
// @grant                 GM_getValue
// @grant                 GM.xmlHttpRequest
// @namespace https://greasyfork.org/users/239593
// @downloadURL https://update.greasyfork.org/scripts/485502/%D0%9A%D0%B0%D1%80%D1%82%D0%B8%D0%BD%D0%BA%D0%B8%20%D1%8E%D0%BD%D0%B8%D1%82%D0%BE%D0%B2%20%D0%93%D0%9B%20%D0%B2%20%D0%BA%D0%BE%D0%BD%D1%86%D0%B5%20%D0%B1%D0%BE%D1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/485502/%D0%9A%D0%B0%D1%80%D1%82%D0%B8%D0%BD%D0%BA%D0%B8%20%D1%8E%D0%BD%D0%B8%D1%82%D0%BE%D0%B2%20%D0%93%D0%9B%20%D0%B2%20%D0%BA%D0%BE%D0%BD%D1%86%D0%B5%20%D0%B1%D0%BE%D1%8F.meta.js
// ==/UserScript==
(function(window, undefined) {
    let dailyRequest = false;
    const doGet = (url, callback) => {
        GM.xmlHttpRequest({
            method: "GET",
            url: url,
            overrideMimeType: "text/xml; charset=windows-1251",
            headers: {
                'User-agent': 'Mozilla/5.0 (Windows; U; Windows NT 5.1; ru; rv:1.8.1)',
                'Accept': 'text/xml,text/html',
                'Content-Type': 'text/plain; charset=windows-1251'
            },
            synchronous: false,
            onload: function(res) {
                callback(new DOMParser().parseFromString(res.responseText, "text/html"))
            }
        });
    }

    let arr = [];
    let arrReserv = [];
    const getLeader = () => {
        let re1 = /(, |опыта )([^,]*)(?= в резерв)/gm;
        let re2 = /((.*) \(|\+(.*) шт.)/gm;
        let final = document.querySelector("#finalresult_text").innerHTML;

        for(let i = 0; i < final.match(re1).length; i++) {
            let m = final.match(re1)[i];

            let name = re2.exec(m.match(re2)[0])[2];

            if(/опыта/i.test(name)) name = name.replace('опыта ', '');
                else name = name.replace(', ', '');
            let count = re2.exec(m.match(re2)[1])[3];

            arrReserv.push({
                replace: final.match(re1)[i],
                name: name,
                fon: arr.find(item => item.name === name).fon,
                img: arr.find(item => item.name === name).img,
                count: Number(count),
                cost: arr.find(item => item.name === name).cost
            });
        }
    }

    const divHtml = () => {
        let divMon = document.createElement('div');
        divMon.setAttribute('style', 'margin-bottom: 20px;');
        document.querySelector("#win_BattleResult > div.info_separator_horizontal").after(divMon);
        let mon = '';
        for(let i = 0; i < arrReserv.length; i++) {
            // document.querySelector("#finalresult_text").innerHTML = document.querySelector("#finalresult_text").innerHTML.replace(arrReserv[i].replace,`<span>, </span><div class="creature_slider_portrait creature_level1 new-leader" title="${arrReserv[i].name}" style="background: url(https://dcdn.heroeswm.ru/i/army_html/fon_lvl${arrReserv[i].fon}.png) no-repeat;image-rendering: -webkit-optimize-contrast;">
            //                             <img src="https://dcdn.heroeswm.ru/i/army_html/frame_lvl${arrReserv[i].fon}.png" class="mon_image2">
            //                             <img src="https://dcdn.heroeswm.ru/i/portraits/${arrReserv[i].img}.png">
            //                             <div class="amount reserve_amount" style="font-size: 20px;">${arrReserv[i].count}</div>
            //                             <p style="display: none;position: absolute; z-index: 10; top: 4px; left: 5px; font-weight: 600; font-size: 11px; color: #140e06;background-color: #f5c140;padding: 1px 5px;border-radius: 4px;">${arrReserv[i].count*arrReserv[i].cost}</p>
            //                         </div>`);

            mon += `<div class="creature_slider_portrait creature_level1 new-leader" title="${arrReserv[i].name}" style="background: url(https://dcdn.heroeswm.ru/i/army_html/fon_lvl${arrReserv[i].fon}.png) no-repeat;image-rendering: -webkit-optimize-contrast;">
                            <img src="https://dcdn.heroeswm.ru/i/army_html/frame_lvl${arrReserv[i].fon}.png" class="mon_image2">
                            <img src="https://dcdn.heroeswm.ru/i/portraits/${arrReserv[i].img}.png">
                            <div class="amount reserve_amount" style="font-size: 20px;">${arrReserv[i].count}</div>
                            <p style="display: none;position: absolute; z-index: 10; top: 4px; left: 5px; font-weight: 600; font-size: 11px; color: #140e06;background-color: #f5c140;padding: 1px 5px;border-radius: 4px;">${arrReserv[i].count*arrReserv[i].cost}</p>
                        </div>`;
        }
        divMon.innerHTML = `<b>Полученные юниты</b><div>${mon}</div>`;

        document.querySelectorAll(".new-leader").forEach(function(el) {
            el.addEventListener('mouseenter', function(e) { //
                this.children[3].style.display = 'block';
            });
            el.addEventListener('mouseleave', function(e) { //
                this.children[3].style.display = 'none';
            });
        });
    }

    const dailyLeader = () => {
        return new Promise(((resolve, reject) => {
            let dailyURL = "https://daily." + location.host.substring(location.host.indexOf(".") + 1) + "/leader/leader";
            doGet(dailyURL, doc => {
                let mon = doc.querySelectorAll("div[class=ccont]");
                let re = /(title="(.*)" href="https|fon_lvl(.*)\.png\?|portraits\/(.*)\.png|">(?=[^.]*$)(.*)<\/a>)/g;
                for(let i = 0; i < mon.length; i++) {
                    let x = mon[i].innerHTML;

                    let name = x.match(re)[0];
                        name = re.exec(name)[2];

                    let fon = x.match(re)[1];
                        fon = re.exec(fon)[3];

                    let img = x.match(re)[2];
                        img = re.exec(img)[4];

                    let cost = x.match(re)[3];
                        cost = re.exec(cost);
                        cost = Number(cost[5]);

                    arr.push({
                        name: name,
                        fon: fon,
                        img: img,
                        cost: cost
                    });
                }
                dailyRequest = true;
                setImg();
                resolve()
            })
        }))
    }
    const setImg = () => {
        if(dailyRequest !== false) {
            let timerId = setInterval(() => {
                if(document.querySelector("#finalresult_text").children.length !== 0) {
                    clearInterval(timerId);
                    if(document.querySelector("#finalresult_text").innerHTML.indexOf('в резерв') !== - 1) {
                        getLeader();
                        divHtml();
                    }
                }
            }, 1000)
        }
    }
    window.onload = function() {
        dailyLeader();
    }
})(window);