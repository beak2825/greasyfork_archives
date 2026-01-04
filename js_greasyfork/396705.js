// ==UserScript==
// @name         咕咕镇数据采集
// @namespace    https://greasyfork.org/users/448113
// @version      1.3.9
// @description  咕咕镇数据采集，目前采集已关闭，兼作助手
// @author       paraii
// @include      https://www.guguzhen.com/*
// @grant        GM_xmlhttpRequest
// @connect      notes.orga.cat
// @connect      www.guguzhen.com
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/js/tooltip.js
// @require      https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/js/popover.js
// @run-at       document-body
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/396705/%E5%92%95%E5%92%95%E9%95%87%E6%95%B0%E6%8D%AE%E9%87%87%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/396705/%E5%92%95%E5%92%95%E9%95%87%E6%95%B0%E6%8D%AE%E9%87%87%E9%9B%86.meta.js
// ==/UserScript==
(function() {
    'use strict'
    var headersPOST = { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'Cookie': document.cookie };

    function submitData() {
        if (localStorage.length > 4 && localStorage.getItem('over') == '1') {
            var meURL = `https://notes.orga.cat/${encodeURI(localStorage.getItem('title')).replace(/%/g, '').replace(/~/g, '7E')}`;
            console.log(meURL);
            GM_xmlhttpRequest({
                method: 'GET',
                url: meURL,
                timeout: 30000,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                onload: response => {
                    let text = response.responseText.match(/content">([\s\S]*)<\/text/)[1];
                    if (text.length == 0) {
                        text = '{"1-50":{"MU":[0],"ZHU":[0],"DENG":[0],"SHOU":[0]},"51-100":{"MU":[0],"ZHU":[0],"DENG":[0],"SHOU":[0]},"101-":{"MU":[0],"ZHU":[0],"DENG":[0],"SHOU":[0]}}'
                    } else {
                        text = text.replace(/&quot;/g, '"');
                    }

                    let json = JSON.parse(text);
                    let pk_i = 0;
                    while (localStorage.getItem(`pk${pk_i}`) != null) {
                        let a = localStorage.getItem(`pk${pk_i}`).split(',');
                        let n = a.shift();
                        for (let j = 1; j < a.length; j++) {
                            a[j] = +a[j];
                        }
                        if (a[3] < 51) {
                            json['1-50'][n].push(a);
                        } else if (a[3] < 101 && a[3] > 50) {
                            json['51-100'][n].push(a);
                        } else {
                            json['101-'][n].push(a);
                        }
                        pk_i++;
                    }

                    text = JSON.stringify(json);
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: meURL,
                        timeout: 30000,
                        headers: headersPOST,
                        data: `text=${text}`,
                        onload: response => {
                            let atrr = localStorage.getItem('attribute');
                            let na = localStorage.getItem('cardName');
                            let ti = localStorage.getItem('title');
                            localStorage.clear();
                            localStorage.setItem('attribute', atrr);
                            localStorage.setItem('cardName', na);
                            localStorage.setItem('title', ti);
                        }
                    });
                }
            });
            return 1;
        } else {
            return 0;
        }
    }

    function eqToAbbr(name) {
        let abbr = 0;
        switch (name[name.length - 1]) {
            case '杖':
                switch (name[name.length - 2]) {
                    case '短':
                        abbr = 'STAFF';
                        break;
                    case '法':
                        abbr = 'WAND';
                        break;
                }
                break;
            case '剑':
                switch (name[name.length - 2]) {
                    case '之':
                        abbr = 'SWORD';
                        break;
                    case '重':
                        abbr = 'CLAYMORE';
                        break;
                }
                break;
            case '刃':
                abbr = 'BLADE';
                break;
            case '首':
                abbr = 'DAGGER';
                break;
            case '盾':
                abbr = 'SHIELD';
                break;
            case '套':
                switch (name[name.length - 3]) {
                    case '者':
                        abbr = 'GLOVES';
                        break;
                    case '鹫':
                        abbr = 'VULTURE';
                        break;
                }
                break;
            case '环':
                abbr = 'BRACELET';
                break;
            case '袍':
                abbr = 'CLOAK';
                break;
            case '巾':
                abbr = 'SCARF';
                break;
            case '饰':
                abbr = 'TIARA';
                break;
            case '带':
                abbr = 'RIBBON';
                break;
            default:
                switch (name[name.length - 2]) {
                    case '短':
                        abbr = 'BOW';
                        break;
                    case '杀':
                        abbr = 'ASSBOW';
                        break;
                    case '布':
                        abbr = 'CLOTH';
                        break;
                    case '皮':
                        abbr = 'LEATHER';
                        break;
                    case '铁':
                        abbr = 'PLATE';
                        break;
                    case '重':
                        abbr = 'THORN';
                        break;
                }
        }
        return abbr;
    }

    function readEquipmentDOM(responseText) {
        let div0 = document.createElement('div');
        div0.innerHTML = `${responseText}</div>`;
        div0.innerHTML = `${div0.children[0].children[1].innerHTML}${div0.children[1].children[1].innerHTML}`;
        return div0;
    }

    function getEquipmentInfo(nodes) {
        let data = new Array();
        if (nodes.length > 0) {
            for (let i = 0; i < nodes.length; i++) {
                if (nodes[i].className.split(' ').length != 3 || nodes[i].innerText.indexOf('+') != -1) {
                    continue;
                }

                let atrr = nodes[i].getAttribute('data-content').match(/>[0-9]+%</g);
                let title = 0;
                title = nodes[i].getAttribute('data-original-title');
                if (title == null) {
                    title = nodes[i].getAttribute('title');
                }
                let lv = title.match(/>[0-9]+</g)[0];
                let name = title.substr(title.lastIndexOf('>') + 1);
                let mys = nodes[i].getAttribute('data-content').match(/\[神秘属性\]/);
                if (mys != null) {
                    mys = 1;
                } else {
                    mys = 0;
                }
                let id = nodes[i].getAttribute('onclick');
                if (id != null) {
                    id = id.match(/[0-9]+/)[0];
                }
                name = eqToAbbr(name);
                data.push(new Array(name, lv.replace('<', '').replace('>', ''), atrr[0].replace('%', '').replace('<', '').replace('>', ''), atrr[1].replace('%', '').replace('<', '').replace('>', ''), atrr[2].replace('%', '').replace('<', '').replace('>', ''), atrr[3].replace('%', '').replace('<', '').replace('>', ''), mys, id));
            }
        }
        return data;
    }
    var equKey = new Array('BLADE', 'ASSBOW', 'WAND', 'STAFF', 'DAGGER', 'CLAYMORE', 'SHIELD', 'BOW', 'SWORD', 'BOUND_0',
        'GLOVES', 'BRACELET', 'VULTURE', 'BOUND_1', 'CLOAK', 'THORN', 'PLATE', 'LEATHER', 'CLOTH', 'BOUND_2', 'SCARF', 'TIARA', 'RIBBON');
    var fullName = new Array('狂信者的荣誉之刃', '反叛者的刺杀弓', '光辉法杖', '探险者短杖', '幽梦匕首', '陨铁重剑', '荆棘剑盾', '探险者短弓', '探险者之剑', 'BOUND_0',
        '探险者手套', '命师的传承手环', '秃鹫手套', 'BOUND_1', '旅法师的灵光袍', '战线支撑者的荆棘重甲', '铁甲', '皮甲', '布甲', 'BOUND_2', '探险者头巾', '占星师的发饰', '天使缎带');
    var sortdict = new Array();
    var fullNameOf = new Array();
    for (let i = 0; i < equKey.length; i++) {
        sortdict[equKey[i]] = i;
        fullNameOf[equKey[i]] = fullName[i];
    }

    function sortEqByName(e1, e2) {
        try {
            let title1 = e1.getAttribute('data-original-title');
            if (title1 == null) {
                title1 = e1.getAttribute('title');
            }
            let name1 = eqToAbbr(title1.substr(title1.lastIndexOf('>') + 1));
            e1.setAttribute('data-abbr', sortdict[name1]);

            let title2 = e2.getAttribute('data-original-title');
            if (title2 == null) {
                title2 = e2.getAttribute('title');
            }
            let name2 = eqToAbbr(title2.substr(title2.lastIndexOf('>') + 1));
            e2.setAttribute('data-abbr', sortdict[name2]);

            return sortdict[name1] - sortdict[name2];
        } catch {
            console.log(e1);
        }
    }

    function getPostData(p1, p2) {
        let data = -1;
        let sc = document.getElementsByTagName('script');
        //console.log(sc);
        for (let i = 0; i < sc.length; i++) {
            let func = sc[i].innerText.match(p1);
            if (func != null) {
                data = func[0].match(p2)[0];
                break;
            }
        }
        return data;
    }

    var user = document.getElementsByClassName('icon-user')[0].parentNode.innerText.split(' ')[1];
    console.log(user)
    if (localStorage.getItem(user) == null) {
        localStorage.setItem(user, '{"dataIndex":{"battleInfoNow":"0","battleInfoBefore":"0","battleInfoBack":"0"},"dataBind":{"0":"0"},"dataBeachSift":{"0":"0"}}');
    }

    function getUserData() {
        return JSON.parse(localStorage.getItem(user));
    }

    function setUserData(json) {
        localStorage.setItem(user, JSON.stringify(json));
    }

    function wishExpireTip() {
        GM_xmlhttpRequest({
            method: 'POST',
            url: `https://www.guguzhen.com/fyg_read.php`,
            headers: headersPOST,
            data: `f=19`,
            onload: response => {
                let cost = response.responseText.split('#')[0];
                //console.log(cost);
                if (parseInt(cost) < 200) {
                    let h = document.getElementsByClassName('panel-heading')[0];
                    h.innerHTML += '<span style="text-align:center;display:block;background-color:red">※许愿池已过期</span>';
                }
            }
        });
    }
    //GM_addStyle(GM_getResourceText('bootstrapcss'));
    if (localStorage.getItem('attribute') == null && localStorage.getItem('cardName') == null) {
        localStorage.setItem('attribute', 0);
        localStorage.setItem('cardName', 0);
    }
    //     if(localStorage.getItem('pk99')!=null&&localStorage.getItem('title')!=null){ //超过100条战斗自动提交
    //         localStorage.setItem('over', 1);
    //         try{
    //             //submitData();
    //         }catch(err){
    //             console.log(err);
    //         }
    //         localStorage.setItem('over', 0);
    //         let nameURL = `https://notes.orga.cat/gugudataname`;
    //         GM_xmlhttpRequest({
    //             method: 'GET',
    //             url: nameURL,
    //             timeout: 30000,
    //             headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
    //             onload: response => {
    //                 let text = response.responseText.match(/content">([\s\S]*)<\/text/)[1];
    //                 let list = text.split(',');
    //                 if(list.indexOf(localStorage.getItem('title'))==-1){
    //                     list.push(localStorage.getItem('title'));
    //                     text = list.join(',');
    //                     GM_xmlhttpRequest({
    //                         method: 'POST',
    //                         url: nameURL,
    //                         timeout: 30000,
    //                         headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
    //                         data: `text=${text}`,
    //                         onload: response => {
    //                             let atrr = localStorage.getItem('attribute');
    //                             let na = localStorage.getItem('cardName');
    //                             let ti = localStorage.getItem('title');
    //                             localStorage.clear();
    //                             localStorage.setItem('attribute',atrr);
    //                             localStorage.setItem('cardName',na);
    //                             localStorage.setItem('title',ti);
    //                         }
    //                     });
    //                 }
    //             }
    //         });
    //     }

    var attribute = new Array();

    if (window.location.pathname == '/fyg_index.php') {
        let userData = getUserData();
        let dataIndex = userData.dataIndex;
        let waitForCol = setInterval(() => {
            if (document.getElementsByClassName('col-md-4') != null) {
                clearInterval(waitForCol);
                dataIndex.battleInfoNow = document.getElementsByClassName('col-md-4')[0].children[4].children[0].innerText;
                let p0 = document.createElement('p');
                if (dataIndex.battleInfoNow == dataIndex.battleInfoBefore) {
                    p0.innerText = `对玩家战斗（上次查看）：${dataIndex.battleInfoBack}`;
                } else {
                    p0.innerText = `对玩家战斗（上次查看）：${dataIndex.battleInfoBefore}`;
                    dataIndex.battleInfoBack = dataIndex.battleInfoBefore;
                    dataIndex.battleInfoBefore = dataIndex.battleInfoNow
                }
                setUserData(userData);
                document.getElementsByClassName('col-md-4')[0].appendChild(p0);
            }
        }, 1000);
    } else if (window.location.pathname == '/fyg_equip.php') {
        let btnc1 = document.createElement('button');
        let timeoutWaitForCard = 0;
        btnc1.innerText = '导出计算器';
        btnc1.onclick = () => {
            try {
                d.innerHTML = '<div class="pop_main">\n<div class="pop_con">\n<div class="pop_text">0</div>\n<div class="pop_text">0</div>\n<a href="#">×</a>\n</div>\n<div class="mask"></div>\n</div>';
                $('.pop_con a').click(() => {
                    $('.pop_con').animate({ 'top': 0, 'opacity': 0 }, () => {
                        $('.pop_main').hide()
                    })
                })
                $('.pop_main').show()
                $('.pop_con').css({ 'top': 0, 'opacity': 0 })
                $('.pop_con').animate({ 'top': '50%', 'opacity': 1 })
                let text = $('.pop_text');
                let cardName = document.querySelector("#backpacks > div:nth-child(1) > div.col-md-4 > div > div.row > div.col-xs-2.fyg_f18.fyg_tr").innerText;
                let cardInfo = document.querySelector("#backpacks > div:nth-child(1) > div.col-md-4 > div > div.fyg_tl").innerText.match(/[0-9]+/g);
                text[1].innerText = `${document.getElementById('sjll').getAttribute('value')} ${document.getElementById('sjmj').getAttribute('value')} ${document.getElementById('sjzl').getAttribute('value')} ${document.getElementById('sjtp').getAttribute('value')} ${document.getElementById('sjjs').getAttribute('value')} ${document.getElementById('sjyz').getAttribute('value')}`;
                switch (cardName) {
                    case '琳':
                        text[0].innerText = `LIN ${cardInfo[0]} ${cardInfo[1]} ${cardInfo[2]}`;
                        break;
                    case '艾':
                        text[0].innerText = `AI ${cardInfo[0]} ${cardInfo[1]} ${cardInfo[2]}`;
                        break;
                    case '默':
                        text[0].innerText = `MO ${cardInfo[0]} ${cardInfo[1]} ${cardInfo[2]}`;
                        break;
                    case '梦':
                        text[0].innerText = `MENG ${cardInfo[0]} ${cardInfo[1]} ${cardInfo[2]}`;
                        break;
                    case '薇':
                        text[0].innerText = `WEI ${cardInfo[0]} ${cardInfo[1]} ${cardInfo[2]}`;
                        break;
                    case '伊':
                        text[0].innerText = `YI ${cardInfo[0]} ${cardInfo[1]} ${cardInfo[2]}`;
                        break;
                }
            } catch (err) { console.log(err); }
        }
        let waitForBackpacks = setInterval(() => {
            if (document.getElementById('backpacks') != null && document.getElementsByClassName('fyg_tc')[3] != null) {
                clearInterval(waitForBackpacks);
                wishExpireTip();
                let div00 = document.createElement('div');
                div00.innerHTML = `<p></p><p><button type="button" class="btn btn-block collapsed" data-toggle="collapse" data-target="#eq0"><i class="icon icon-caret-down"></i></button></p>
        <div class="in" id="eq0"></div>
<p><button type="button" class="btn btn-block collapsed" data-toggle="collapse" data-target="#eq1"><i class="icon icon-caret-down"></i></button></p>
        <div class="in" id="eq1"></div>
<p><button type="button" class="btn btn-block collapsed" data-toggle="collapse" data-target="#eq2"><i class="icon icon-caret-down"></i></button></p>
        <div class="in" id="eq2"></div>
<p><button type="button" class="btn btn-block collapsed" data-toggle="collapse" data-target="#eq3"><i class="icon icon-caret-down"></i></button></p>
        <div class="in" id="eq3"></div>
<p><button type="button" class="btn btn-block collapsed" data-toggle="collapse" data-target="#eq4"><i class="icon icon-caret-down"></i>护符</button></p>
        <div class="in" id="eq4"></div>`;

                let eqbtns = null;

                function addCollapse() {
                    let waitForBtn = setInterval(() => {
                        if (document.getElementsByClassName('fyg_tc')[3] != null) {
                            eqbtns = [].slice.call(document.getElementsByClassName('fyg_tc')[3].children);
                            if (document.getElementById('backpacks').innerText.indexOf('读取中') == -1 &&
                                eqbtns.length > 0 && eqbtns[0].className.split(' ')[2] == 'fyg_mp3' &&
                                document.getElementById('carding').innerText.indexOf('读取中') == -1) {
                                clearInterval(waitForBtn);

                                let eqstore = document.getElementById('backpacks').children[1].children[1].children;
                                for (let i = 0; i < eqstore.length; i++) {
                                    if (eqstore[i].className.split(' ').length == 3) {
                                        eqstore[i].dataset.instore = 1;
                                    }
                                }
                                eqbtns = [].slice.call(document.getElementsByClassName('fyg_tc')[3].children)
                                    .concat([].slice.call(document.getElementById('backpacks').children[0].children[1].children))
                                    .concat([].slice.call(document.getElementById('backpacks').children[1].children[1].children));
                                for (let i = eqbtns.length - 1; i >= 0; i--) {
                                    if (eqbtns[i].className.split(' ').length != 3) {
                                        eqbtns.splice(i, 1);
                                    }
                                }
                                // if (eqbtns[eqbtns.length - 1].className.split(' ')[2] != 'fyg_mp3') {
                                //     eqbtns = eqbtns.slice(0, -2);
                                // }
                                //console.log(eqbtns);
                                if (document.getElementsByClassName('collapsed').length == 0) {
                                    document.getElementById('backpacks').insertBefore(div00, document.getElementById('backpacks').lastChild);
                                }
                                for (let i = eqbtns.length - 1; i >= 0; i--) {
                                    if (eqbtns[i].className.split(' ')[0] == 'popover') {
                                        eqbtns.splice(i, 1);
                                        break;
                                    }
                                }
                                eqbtns.sort(sortEqByName);
                                document.getElementById('eq0').innerHTML = '';
                                document.getElementById('eq1').innerHTML = '';
                                document.getElementById('eq2').innerHTML = '';
                                document.getElementById('eq3').innerHTML = '';
                                document.getElementById('eq4').innerHTML = '';
                                let ineq = document.getElementById('eq0');

                                for (let i = 0; i < eqbtns.length; i++) {
                                    if (eqbtns[i].innerText == '空') {
                                        continue;
                                    }

                                    let btn0 = document.createElement('button');
                                    btn0.setAttribute('class', 'btn btn-light');
                                    btn0.setAttribute('onclick', eqbtns[i].getAttribute('onclick'));
                                    let storeText = '';
                                    if (eqbtns[i].dataset.instore == 1) {
                                        storeText = '【仓】';
                                    }
                                    btn0.innerHTML = `<h3 class="popover-title" style="color:white;background-color: ${getComputedStyle(eqbtns[i]).getPropertyValue("background-color")}">${storeText}${eqbtns[i].dataset.originalTitle}</h3><div class="popover-content-show">${eqbtns[i].dataset.content}</div>`;
                                    if (btn0.children[1].lastChild.nodeType == 3) { //清除背景介绍文本
                                        btn0.children[1].lastChild.remove();
                                    }

                                    if (eqbtns[i].innerText.indexOf('+') != -1) {
                                        ineq = document.getElementById('eq4');
                                        //console.log(btn0);
                                    } else {
                                        let a = parseInt(eqbtns[i].dataset.abbr);

                                        if (a >= sortdict.BOUND_0 && a < sortdict.BOUND_1) {
                                            ineq = document.getElementById('eq1');
                                        } else if (a >= sortdict.BOUND_1 && a < sortdict.BOUND_2) {
                                            ineq = document.getElementById('eq2');
                                        } else if (a >= sortdict.BOUND_2) {
                                            ineq = document.getElementById('eq3');
                                        } else {
                                            ineq = document.getElementById('eq0');
                                        }
                                    }

                                    ineq.appendChild(btn0);
                                }

                                let collapseStore = document.createElement('button');
                                collapseStore.innerText = '折叠';
                                collapseStore.style.float = 'right';
                                collapseStore.onclick = () => {
                                    if ($('#backpacks > div.alert.alert-success.with-icon > div').css('display') == 'none') {
                                        $('#backpacks > div.alert.alert-success.with-icon > div').show();
                                        collapseStore.innerText = '折叠';
                                    } else {
                                        $('#backpacks > div.alert.alert-success.with-icon > div').hide();
                                        collapseStore.innerText = '展开';
                                    }
                                }
                                if (document.getElementById('backpacks').children[1].children.length == 2) {
                                    document.getElementById('backpacks').children[1].appendChild(collapseStore);
                                }

                                $('.popover-content-show').css({
                                    'padding': '10px 10px 0px 10px'
                                });
                                $('.btn-light').css({
                                    'padding': 0,
                                    'text-align': 'left',
                                    'box-shadow': 'none',
                                    'background-color': 'none',
                                    'line-height': '90%'
                                });
                                $('.bg-danger').css({
                                    'padding': '5px 5px 5px 5px',
                                    'max-width': '200px',
                                    'white-space': 'pre-line',
                                    'word-break': 'break-all',
                                    'line-height': '110%'
                                });
                            }
                        }
                    }, 500);
                }
                if (document.getElementsByClassName('nav nav-secondary nav-justified')[0].children[0].className == 'active') { addCollapse(); }

                let cardPagePop = document.createElement('div');
                cardPagePop.setAttribute('id', 'cardpage_pop');
                let initHTML = `<div class="popup-content">
        <div class="topline">
            <p></p>
            <div class="equipment_selector"></div>
        </div>
        <div class="topline">
            <p></p>
            <div class="equipment_selector"></div>
        </div>
        <div class="topline">
            <p></p>
            <div class="equipment_selector"></div>
        </div>
        <div class="topline">
            <p></p>
            <div class="equipment_selector"></div>
        </div>
        <p></p>
        <div class="halo_selector"></div>
        <p id="load_tip">读取中...</p>
        <button type="button" id="bind">绑定</button>
        <button type="button" onclick="unbind()">解除绑定</button>
        <button type="button" onclick="quit()">取消</button>
    </div>`;
                cardPagePop.innerHTML = `<style>
    .popup {
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, .5);
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        z-index: 9999;
        display: none;
        justify-content: center;
        align-items: center;
    }

    .popup-content {
        width: 400px;
        height: 200px;
        background-color: #fff;
        box-sizing: border-box;
        padding: 10px 30px;
        color: black;
    }

    .topline {
        width: 100%;
        border-bottom: 1px solid black;
    }
</style>

<div class="popup" id="popup">
${initHTML}
</div>`;

                unsafeWindow.equipOnekey = function(t) {
                    $('.popup-content').height(100);
                    $('.popup-content').width(100);
                    document.getElementById("popup").innerHTML = `<div class="popup-content">
        <div class="topline">
            <p></p>
            <div>装备×</div>
            <div>光环×</div>
        </div>
        <div>更换中..</div>
        <button type="button" onclick="quit()">取消</button>
    </div>`;
                    let role = t.parentNode.parentNode.parentNode.parentNode.children[0].children[0];
                    let roleId = role.getAttribute('onclick').match(/[0-9]+/)[0];
                    role = role.children[0].innerText.replace(/\s+/g, '').split('级')[1] + role.children[1].innerText.replace(/\s+/g, '');
                    console.log(`equipOnekey: ${roleId} ${role}`);

                    let bind_info = null;
                    let ud = getUserData();
                    if (ud.dataBind[roleId] != null) {
                        bind_info = ud.dataBind[roleId];
                    }
                    //                                                         else{
                    //                                                             bind_info = localStorage.getItem(`${role}`);
                    //                                                             ud.dataBind[role] = bind_info; //数据兼容转移
                    //                                                             setUserData(ud);
                    //                                                             localStorage.removeItem(`${role}`);
                    //                                                         }

                    console.log(`bind_info of role:${bind_info}`);
                    console.log(`ID of role:${roleId}`);

                    function sendEquipHttpRequest(eqinfo) {
                        let request = GM_xmlhttpRequest({
                            method: 'POST',
                            url: `https://www.guguzhen.com/fyg_read.php`,
                            headers: headersPOST,
                            data: 'f=7',
                            onload: response => {
                                let div0 = readEquipmentDOM(response.responseText);
                                let equipment = getEquipmentInfo(div0.children);

                                let ids = new Array();
                                for (let i = 0; i < eqinfo.length; i++) {
                                    for (let j = 0; j < equipment.length; j++) {
                                        if (eqinfo[i] == equipment[j].slice(0, -2).join()) {
                                            ids.push(equipment[j]);
                                            break;
                                        }
                                    }
                                }
                                let c = ids.length;
                                let puton_data = getPostData(/puton\(id\)\{[\s\S]*\}/m, /data: ".*\+id\+.*"/).slice(7, -1);

                                for (let i = 0; i < ids.length; i++) {
                                    GM_xmlhttpRequest({
                                        method: 'POST',
                                        url: `https://www.guguzhen.com/fyg_click.php`,
                                        headers: headersPOST,
                                        data: puton_data.replace('"+id+"', ids[i][ids[i].length - 1]),
                                        onload: response => {
                                            if (response.responseText == 'ok') {
                                                c--;
                                                if (c == 0) {
                                                    document.getElementsByClassName('topline')[0].children[1].innerText = '装备√';
                                                    if (document.getElementsByClassName('topline')[0].children[2].innerText == '光环√') {
                                                        window.location.reload();
                                                        document.getElementById("popup").style.display = "none";
                                                    }
                                                }
                                            }
                                        }
                                    });
                                }
                            }

                        });
                        return request;
                    }

                    function sendBeginEquipHttpRequest(bind_info) {
                        let isStore = false;
                        document.getElementsByClassName('topline')[0].children[1].innerText = '装备×';
                        let request = GM_xmlhttpRequest({
                            method: 'POST',
                            url: `https://www.guguzhen.com/fyg_read.php`,
                            headers: headersPOST,
                            data: 'f=7',
                            onload: response => {
                                let div0 = readEquipmentDOM(response.responseText);
                                let equipment = getEquipmentInfo(div0.children);
                                let equiped = getEquipmentInfo(document.getElementsByClassName('fyg_tc')[3].children);

                                let ids = new Array();
                                let err = 0;
                                for (let i = 0; i < 4; i++) {
                                    let exist = 0;
                                    for (let j = 0; j < 4; j++) {
                                        if (bind_info[i] == equiped[j].slice(0, -2).join()) { //已装备
                                            exist = 1;
                                            break;
                                        }
                                    }
                                    if (exist == 0) { //未装备
                                        for (let j = 0; j < equipment.length; j++) {
                                            if (bind_info[i] == equipment[j].slice(0, -2).join()) {
                                                ids.push(equipment[j]);
                                                exist = 1;
                                                break;
                                            }
                                        }
                                        if (exist == 0) {
                                            console.log(bind_info[i]);
                                            alert('有装备不存在，请重新绑定');
                                            err = 1;
                                            window.location.reload();
                                        }
                                    }
                                }

                                if (err == 0) {
                                    let c = ids.length;
                                    if (c == 0) {
                                        document.getElementsByClassName('topline')[0].children[1].innerText = '装备√';
                                        if (document.getElementsByClassName('topline')[0].children[2].innerText == '光环√') {
                                            window.location.reload();
                                            document.getElementById("popup").style.display = "none";
                                        }
                                    }
                                    let puton_data = getPostData(/puton\(id\)\{[\s\S]*\}/m, /data: ".*\+id\+.*"/).slice(7, -1);
                                    let puto_data = 'c=22' + puton_data.slice(3);

                                    let storeCount = 0;
                                    let storePuton = new Array();

                                    for (let i = 0; i < ids.length; i++) {
                                        GM_xmlhttpRequest({
                                            method: 'POST',
                                            url: `https://www.guguzhen.com/fyg_click.php`,
                                            headers: headersPOST,
                                            data: puton_data.replace('"+id+"', ids[i][ids[i].length - 1]),
                                            onload: response => {
                                                if (response.responseText == 'ok') {
                                                    c--;
                                                    if (c == 0 && !isStore) {
                                                        document.getElementsByClassName('topline')[0].children[1].innerText = '装备√';
                                                        if (document.getElementsByClassName('topline')[0].children[2].innerText == '光环√') {
                                                            window.location.reload();
                                                            document.getElementById("popup").style.display = "none";
                                                        }
                                                    } else if (c == 0 && isStore) {
                                                        request = sendEquipHttpRequest(storePuton);
                                                    }
                                                } else if (response.responseText == '这不是你的装备') {
                                                    let item = ids[i].slice(0, -1);
                                                    item = new Array(fullNameOf[item[0]], `Lv${item[1]}`, `${item[2]}%`, `${item[3]}%`, `${item[4]}%`, `${item[5]}%`, `${item[6] == 1 ? '神秘' : ''}`).join(' ');
                                                    //alert(`${item}\n在仓库中，装备失败，请检查`);
                                                    storeCount++;
                                                    document.getElementsByClassName('topline')[0].children[1].innerText = '装备×    取出仓库...';
                                                    GM_xmlhttpRequest({
                                                        method: 'POST',
                                                        url: `https://www.guguzhen.com/fyg_click.php`,
                                                        headers: headersPOST,
                                                        data: puto_data.replace('"+id+"', ids[i][ids[i].length - 1]),
                                                        onload: response => {
                                                            console.log(response.responseText);
                                                            if (response.responseText == 'ok') {
                                                                storeCount--;
                                                                if (storeCount == 0) {
                                                                    document.getElementsByClassName('topline')[0].children[1].innerText = '装备×';
                                                                }

                                                                isStore = true;
                                                                storePuton.push(ids[i].slice(0, 6));
                                                                c--;
                                                                if (c == 0) {
                                                                    request = sendEquipHttpRequest(storePuton);
                                                                }
                                                            } else if (response.responseText == '背包已满。') {
                                                                alert(`背包已满，仓库装备\n${item}\n无法取出，请整理背包`);
                                                                c--;
                                                                if (c == 0 && !isStore) {
                                                                    document.getElementsByClassName('topline')[0].children[1].innerText = '装备√';
                                                                    if (document.getElementsByClassName('topline')[0].children[2].innerText == '光环√') {
                                                                        window.location.reload();
                                                                        document.getElementById("popup").style.display = "none";
                                                                    }
                                                                } else if (c == 0 && isStore) {
                                                                    request = sendEquipHttpRequest(storePuton);
                                                                }
                                                            }
                                                        }
                                                    });

                                                }
                                            }
                                        });
                                    }
                                }
                            }
                        });
                        return request;
                    }
                    let upcard_data = getPostData(/upcard\(id\)\{[\s\S]*\}/m, /data: ".*\+id\+.*"/).slice(7, -1).replace('"+id+"', roleId);

                    if (bind_info != null) {
                        GM_xmlhttpRequest({
                            method: 'POST',
                            url: `https://www.guguzhen.com/fyg_click.php`,
                            headers: headersPOST,
                            data: upcard_data,
                            onload: response => {
                                if (response.responseText == 'ok' || response.responseText == '你没有这张卡片或已经装备中') {
                                    console.log(`card response: ${response.responseText}`);
                                    bind_info = bind_info.split('|');
                                    let equRequest = sendBeginEquipHttpRequest(bind_info);

                                    let halo = bind_info[bind_info.length - 1].split(',');
                                    for (let i = 0; i < halo.length; i++) {
                                        switch (halo[i]) {
                                            case '启程之誓':
                                                halo[i] = '101';
                                                break;
                                            case '启程之心':
                                                halo[i] = '102';
                                                break;
                                            case '启程之风':
                                                halo[i] = '103';
                                                break;
                                            case '破壁之心':
                                                halo[i] = '201';
                                                break;
                                            case '破魔之心':
                                                halo[i] = '202';
                                                break;
                                            case '复合护盾':
                                                halo[i] = '203';
                                                break;
                                            case '鲜血渴望':
                                                halo[i] = '204';
                                                break;
                                            case '削骨之痛':
                                                halo[i] = '205';
                                                break;
                                            case '伤口恶化':
                                                halo[i] = '301';
                                                break;
                                            case '精神创伤':
                                                halo[i] = '302';
                                                break;
                                            case '铁甲尖刺':
                                                halo[i] = '303';
                                                break;
                                            case '忍无可忍':
                                                halo[i] = '304';
                                                break;
                                            case '热血战魂':
                                                halo[i] = '305';
                                                break;
                                            case '点到为止':
                                                halo[i] = '306';
                                                break;
                                            case '沸血之志':
                                                halo[i] = '401';
                                                break;
                                            case '波澜不惊':
                                                halo[i] = '402';
                                                break;
                                            case '飓风之力':
                                                halo[i] = '403';
                                                break;
                                            case '红蓝双刺':
                                                halo[i] = '404';
                                                break;
                                            case '荧光护盾':
                                                halo[i] = '405';
                                                break;
                                            case '绝对护盾': //old
                                                halo[i] = '405';
                                                break;
                                            case '后发制人':
                                                halo[i] = '406';
                                                break;
                                        }
                                    }
                                    let halosave_data = getPostData(/halosave\(\)\{[\s\S]*\}/m, /data: ".*\+savearr\+.*"/).slice(7, -1).replace('"+savearr+"', halo.join());
                                    let haloRequest = GM_xmlhttpRequest({
                                        method: 'POST',
                                        url: `https://www.guguzhen.com/fyg_click.php`,
                                        headers: headersPOST,
                                        data: halosave_data,
                                        onload: response => {
                                            if (response.responseText == 'ok') {
                                                document.getElementsByClassName('topline')[0].children[2].innerText = '光环√';
                                                if (document.getElementsByClassName('topline')[0].children[1].innerText == '装备√') {
                                                    window.location.reload();
                                                    document.getElementById("popup").style.display = "none";
                                                }
                                            }
                                        }
                                    });
                                    unsafeWindow.quit = function() {
                                        document.getElementById("popup").style.display = "none";
                                        equRequest.abort();
                                        haloRequest.abort();
                                        document.getElementById("popup").innerHTML = initHTML;
                                    };
                                    document.getElementById("popup").style.display = "flex";
                                }
                            }
                        });
                    } else {
                        alert('未绑定');
                    }

                }

                unsafeWindow.showPopup = function(t) {
                    document.getElementById("popup").innerHTML = initHTML;
                    let role = t.parentNode.parentNode.parentNode.parentNode.children[0].children[0];
                    let roleId = role.getAttribute('onclick').match(/[0-9]+/)[0];
                    role = role.children[0].innerText.replace(/\s+/g, '').split('级')[1] + role.children[1].innerText.replace(/\s+/g, '');
                    console.log(`bindRole: ${roleId} ${role}`);

                    let bind_info = null;
                    let ud = getUserData();
                    if (ud.dataBind[roleId] != null) {
                        bind_info = ud.dataBind[roleId];
                    }
                    if (bind_info != null) {
                        bind_info = bind_info.split('|');
                    }
                    let equRequest = GM_xmlhttpRequest({ //获取装备
                        method: 'POST',
                        url: `https://www.guguzhen.com/fyg_read.php`,
                        headers: headersPOST,
                        data: 'f=7',
                        onload: response => {
                            let div0 = readEquipmentDOM(response.responseText);
                            let equipment = getEquipmentInfo(div0.children);
                            equipment = equipment.concat(getEquipmentInfo(document.getElementsByClassName('fyg_tc')[3].children));
                            $('.popup-content').height(Math.min(equipment.length, 19) * 25 + 120);
                            $('.popup-content').width(400);
                            $('.popup-content').css('overflow', 'scroll');


                            let e = new Array(new Array(), new Array(), new Array(), new Array());
                            let origin = new Array(new Array(), new Array(), new Array(), new Array());
                            equipment.sort((e1, e2) => {
                                return sortdict[e1[0]] - sortdict[e2[0]];
                            });

                            equipment.forEach(item => {
                                let i = 0;
                                if (sortdict[item[0]] < sortdict.BOUND_0) {
                                    i = 0;
                                } else if (sortdict[item[0]] >= sortdict.BOUND_0 && sortdict[item[0]] < sortdict.BOUND_1) {
                                    i = 1;
                                } else if (sortdict[item[0]] >= sortdict.BOUND_1 && sortdict[item[0]] < sortdict.BOUND_2) {
                                    i = 2;
                                } else {
                                    i = 3;
                                }
                                origin[i].push(item)
                                    //添加文字
                                e[i].push(new Array(fullNameOf[item[0]], `Lv${item[1]}`, `${item[2]}%`, `${item[3]}%`, `${item[4]}%`, `${item[5]}%`, `${item[6] == 1 ? '神秘' : ''}`));
                            });

                            function selector_equ() {
                                var equipNum = $('.equipment_selector .equipment_item').index(this);
                                $('.equipment_selector .equipment_item')
                                    .eq(equipNum)
                                    .css('background-color', 'rgb(135, 206, 250)')
                                    .siblings('.equipment_selector .equipment_item')
                                    .css('background-color', 'rgb(255, 255, 255)');
                            }

                            let content = document.getElementsByClassName('equipment_selector');
                            for (let i = 0; i < 4; i++) {
                                for (let j = 0; j < e[i].length; j++) {
                                    let li0 = document.createElement('li');
                                    li0.setAttribute('class', 'equipment_item');
                                    li0.addEventListener('click', selector_equ, false);
                                    li0.innerHTML = `<a href="javascript:void(0)">${e[i][j].join(' ')}</a>`;

                                    if (bind_info != null && bind_info.indexOf(origin[i][j].slice(0, -2).join(',')) != -1) {
                                        li0.style.backgroundColor = 'rgb(135, 206, 250)';
                                    }
                                    content[i].appendChild(li0);
                                }
                            }

                        }
                    });



                    localStorage.setItem('halo_max', '0'); //天赋点
                    let haloRequest = GM_xmlhttpRequest({ //获取天赋点
                        method: 'POST',
                        url: `https://www.guguzhen.com/fyg_read.php`,
                        headers: headersPOST,
                        data: 'f=5',
                        onload: response => {
                            let halo = response.responseText.match(/<h3>.*</)[0].slice(4, -1);
                            localStorage.setItem('halo_max', halo.match(/[0-9]+/).join());
                            halo = `天赋点：${halo.match(/[0-9]+/)[0]}，技能位：${role.match(/[0-9]技/)[0].slice(0, 1)}`;
                            document.getElementsByClassName('halo_selector')[0].innerHTML = `<div>${halo}</div>
    <a href="javascript:void(0)" class="halo_item">启程之誓 10</a>
    <a href="javascript:void(0)" class="halo_item">启程之心 10</a>
    <a href="javascript:void(0)" class="halo_item">启程之风 10</a>
    <div></div>
    <a href="javascript:void(0)" class="halo_item">破壁之心 30</a>
    <a href="javascript:void(0)" class="halo_item">破魔之心 30</a>
    <a href="javascript:void(0)" class="halo_item">复合护盾 30</a>
    <a href="javascript:void(0)" class="halo_item">鲜血渴望 30</a>
    <a href="javascript:void(0)" class="halo_item">削骨之痛 30</a>
    <div></div>
    <a href="javascript:void(0)" class="halo_item">伤口恶化 50</a>
    <a href="javascript:void(0)" class="halo_item">精神创伤 50</a>
    <a href="javascript:void(0)" class="halo_item">铁甲尖刺 50</a>
    <a href="javascript:void(0)" class="halo_item">忍无可忍 50</a>
    <a href="javascript:void(0)" class="halo_item">热血战魂 50</a>
    <a href="javascript:void(0)" class="halo_item">点到为止 50</a>
    <div></div>
    <a href="javascript:void(0)" class="halo_item">沸血之志 100</a>
    <a href="javascript:void(0)" class="halo_item">波澜不惊 100</a>
    <a href="javascript:void(0)" class="halo_item">飓风之力 100</a>
    <a href="javascript:void(0)" class="halo_item">红蓝双刺 100</a>
    <a href="javascript:void(0)" class="halo_item">荧光护盾 100</a>
    <a href="javascript:void(0)" class="halo_item">后发制人 100</a>`;

                            function selector_halo() {
                                if ($(this).css('background-color') != 'rgb(135, 206, 250)') {
                                    $(this).css('background-color', 'rgb(135, 206, 250)');
                                } else {
                                    $(this).css('background-color', 'rgb(255, 255, 255)');
                                }
                            }
                            $('.halo_item').each(function(i, e) {
                                $(e).on('click', selector_halo);
                                if (bind_info != null && bind_info[4].split(',').indexOf($(e).text().split(' ')[0]) != -1) {
                                    $(e).css('background-color', 'rgb(135, 206, 250)');
                                }
                            });
                            document.getElementById('load_tip').innerText = '';
                        }
                    });

                    unsafeWindow.quit = function() {
                        document.getElementById("popup").style.display = "none";
                        equRequest.abort();
                        haloRequest.abort();
                        document.getElementById("popup").innerHTML = initHTML;
                    };

                    unsafeWindow.unbind = function() {
                        let ud = getUserData();
                        if (ud.dataBind[roleId] != null) {
                            delete ud.dataBind[roleId];
                        }
                        setUserData(ud);
                    };


                    //绑定
                    function hidePopup() {
                        let equ = new Array();
                        let halo = new Array();
                        let sum = 0;
                        $(".equipment_item").each(function(i, e) {
                            if ($(e).attr("style") != null && $(e).css("background-color") != "rgb(255, 255, 255)") {
                                equ.push(e.innerText.split(' '));
                            }
                        });
                        $(".halo_item").each(function(i, e) {
                            if ($(e).attr("style") != null && $(e).css("background-color") != "rgb(255, 255, 255)") {
                                let ee = e.innerText.split(' ');
                                sum += parseInt(ee[1]);
                                halo.push(ee[0]);
                            }
                        });
                        let h = parseInt(localStorage.getItem('halo_max'));
                        if (equ.length == 4 && sum <= h && halo.length <= parseInt(role.match(/[0-9]技/).slice(0, 1))) {
                            for (let i = 0; i < 4; i++) {
                                equ[i] = equ[i].slice(0, 6)
                                let name = equ[i][0];
                                name = eqToAbbr(name);
                                equ[i][0] = name;
                                equ[i][1] = equ[i][1].substr(2);
                                for (let j = 2; j < 6; j++) {
                                    equ[i][j] = equ[i][j].slice(0, -1)
                                }
                                console.log(equ[i]);
                            }
                            let bind_info = new Array(equ[0], equ[1], equ[2], equ[3], halo);
                            let ud = getUserData();
                            ud.dataBind[roleId] = bind_info.join('|');
                            setUserData(ud);
                            console.log(localStorage);

                            document.getElementById('popup').innerHTML = initHTML;
                            document.getElementById('popup').style.display = 'none';
                        } else {
                            alert('有装备未选或天赋错误');
                        }
                    }
                    document.getElementById('bind').addEventListener('click', hidePopup, false);
                    document.getElementById('popup').style.display = 'flex';
                };

                function addBindBtn() {
                    let col6 = document.querySelector('#backpacks > div:nth-child(1) > div.col-md-6');

                    let btng = document.createElement('div');
                    btng.className = 'btn-group';
                    col6.insertBefore(btng, col6.children[2]);

                    let s0 = document.createElement('span');
                    s0.setAttribute('class', 'fyg_lh30');
                    s0.innerHTML = '<a href="###" style="color:#F00" onclick="showPopup(this)"> 绑定装备&光环 </a>'
                    btng.appendChild(s0);

                    let s1 = document.createElement('span');
                    s1.setAttribute('class', 'fyg_lh30');
                    s1.innerHTML = '<a href="###" style="color:#00FF" onclick="equipOnekey(this)"> 一键装备 </a>'
                    btng.appendChild(s1);

                    let p = document.getElementsByClassName('panel panel-primary')[1];
                    if (p.lastChild.id != 'cardpage_pop') {
                        p.appendChild(cardPagePop);
                    }
                }

                let waitForHomePage = setInterval(() => {
                    let col6 = document.querySelector('#backpacks > div:nth-child(1) > div.col-md-6');
                    if (col6 != null && col6.children[1].innerText.includes('卡片') && col6.children.length == 5) {
                        clearInterval(waitForHomePage);
                        addBindBtn();
                    }
                }, 100);

                let observer = new MutationObserver((mutationsList, observer) => {
                    let page = document.getElementsByClassName('nav nav-secondary nav-justified')[0].children;
                    let index = 0;
                    for (let i = 0; i < 4; i++) {
                        if (page[i].className == 'active') {
                            index = i;
                        }
                    }
                    switch (index) {
                        case 0:
                            $('.pop_main').hide();
                            btnc1.onclick = () => {
                                $('.pop_main').show()
                                $('.pop_con').css({ 'top': 0, 'opacity': 0 })
                                $('.pop_con').animate({ 'top': '50%', 'opacity': 1 })
                                try {
                                    let bag = [].slice.call(document.getElementById('backpacks').children[0].children[1].children)
                                        .concat([].slice.call(document.getElementById('backpacks').children[1].children[1].children));
                                    let bagdata = new Array();
                                    let equip = document.getElementsByClassName('fyg_tc')[3];
                                    let data = new Array();

                                    if (bag[bag.length - 1].className.split(' ')[2] != 'fyg_mp3') {
                                        bag = bag.slice(0, -1);
                                    }
                                    //console.log(bag)
                                    bagdata = getEquipmentInfo(bag);
                                    data = getEquipmentInfo(equip.children);
                                    bagdata.sort((e1, e2) => {
                                        return sortdict[e1[0]] - sortdict[e2[0]];
                                    });
                                    //console.log(bagdata);
                                    d.innerHTML = `<div class="pop_main">
    <div class="pop_con">
        <div class="pop_text">/</div>
        <div class="pop_text">/</div>
        <div class="pop_text">/</div>
        <div class="pop_text">/</div>
        <div class="pop_text" style="color:red">Bag:</div>
        ${new Array(bagdata.length + 1).join('<div class="pop_text">/</div>')}
        <div class="pop_text" style="color:red">Amulet:</div>
        <div class="pop_text">/</div>
<a href="#">×</a>
    </div>
</div>`;
                                    $('.pop_con a').click(() => {
                                        $('.pop_con').animate({ 'top': 0, 'opacity': 0 }, () => {
                                            $('.pop_main').hide()
                                        })
                                    })
                                    $('.pop_main').show()
                                    $('.pop_con').css({ 'top': 0, 'opacity': 0 })
                                    $('.pop_con').animate({ 'top': '50%', 'opacity': 1 })
                                    let text = $('.pop_text');

                                    text[0].innerText = `${data[0].slice(0, -1).join(' ')}`;
                                    text[1].innerText = `${data[1].slice(0, -1).join(' ')}`;
                                    text[2].innerText = `${data[2].slice(0, -1).join(' ')}`;
                                    text[3].innerText = `${data[3].slice(0, -1).join(' ')}`;

                                    for (let i = 0; i < bagdata.length; i++) {
                                        text[5 + i].innerText = `${bagdata[i].slice(0, -1).join(' ')}`;
                                    }

                                    let amulet = document.getElementById('backpacks').lastChild.children[1].innerText.match(/\+[0-9]+/g);
                                    let amuletAbbr = new Array('STR', 'AGI', 'INT', 'VIT', 'SPR', 'MND', 'PATK', 'MATK', 'SPD', 'REC', 'HP', 'SLD', 'LCH', 'RFL', 'CRT', 'SKL', 'PDEF', 'MDEF');
                                    for (let i = amulet.length - 1; i >= 0; i--) {
                                        if (amulet[i][1] == '0') {
                                            amulet.splice(i, 1);
                                        } else {
                                            amulet[i] = amuletAbbr[i] + amulet[i];
                                        }

                                    }
                                    text[6 + bagdata.length].innerText = `AMULET ${amulet.join(' ').replace(/\+/g, ' ')} ENDAMULET`;

                                } catch (err) { console.log(err); }
                            }
                            try {
                                if (!((mutationsList[0].addedNodes[0].className != null && mutationsList[0].addedNodes[0].className.split(' ')[0] == 'popover') ||
                                        (mutationsList[0].removedNodes[0].className != null && mutationsList[0].removedNodes[0].className.split(' ')[0] == 'popover'))) {
                                    addCollapse();
                                }
                            } catch (err) {}
                            break;
                        case 1:
                            $('.pop_main').hide();
                            btnc1.onclick = () => { console.log('Click None'); };

                            var observerCard = new MutationObserver(() => {
                                observerCard.disconnect();
                                console.log('Backpacks Changed');
                                try {
                                    let col6 = document.querySelector('#backpacks > div:nth-child(1) > div.col-md-6');
                                    if (col6.children[1].innerText.includes('卡片') && col6.children.length == 5) {

                                        btnc1.onclick = () => {
                                            try {
                                                d.innerHTML = '<div class="pop_main">\n<div class="pop_con">\n<div class="pop_text">0</div>\n<div class="pop_text">0</div>\n<a href="#">×</a>\n</div>\n<div class="mask"></div>\n</div>';
                                                $('.pop_con a').click(() => {
                                                    $('.pop_con').animate({ 'top': 0, 'opacity': 0 }, () => {
                                                        $('.pop_main').hide()
                                                    })
                                                })
                                                $('.pop_main').show()
                                                $('.pop_con').css({ 'top': 0, 'opacity': 0 })
                                                $('.pop_con').animate({ 'top': '50%', 'opacity': 1 })
                                                let text = $('.pop_text');
                                                let cardName = document.querySelector("#backpacks > div:nth-child(1) > div.col-md-4 > div > div.row > div.col-xs-2.fyg_f18.fyg_tr").innerText;
                                                let cardInfo = document.querySelector("#backpacks > div:nth-child(1) > div.col-md-4 > div > div.fyg_tl").innerText.match(/[0-9]+/g);
                                                text[1].innerText = `${document.getElementById('sjll').getAttribute('value')} ${document.getElementById('sjmj').getAttribute('value')} ${document.getElementById('sjzl').getAttribute('value')} ${document.getElementById('sjtp').getAttribute('value')} ${document.getElementById('sjjs').getAttribute('value')} ${document.getElementById('sjyz').getAttribute('value')}`;
                                                switch (cardName) {
                                                    case '琳':
                                                        text[0].innerText = `LIN ${cardInfo[0]} ${cardInfo[1]} ${cardInfo[2]}`;
                                                        break;
                                                    case '艾':
                                                        text[0].innerText = `AI ${cardInfo[0]} ${cardInfo[1]} ${cardInfo[2]}`;
                                                        break;
                                                    case '默':
                                                        text[0].innerText = `MO ${cardInfo[0]} ${cardInfo[1]} ${cardInfo[2]}`;
                                                        break;
                                                    case '梦':
                                                        text[0].innerText = `MENG ${cardInfo[0]} ${cardInfo[1]} ${cardInfo[2]}`;
                                                        break;
                                                    case '薇':
                                                        text[0].innerText = `WEI ${cardInfo[0]} ${cardInfo[1]} ${cardInfo[2]}`;
                                                        break;
                                                    case '伊':
                                                        text[0].innerText = `YI ${cardInfo[0]} ${cardInfo[1]} ${cardInfo[2]}`;
                                                        break;
                                                }
                                            } catch (err) { console.log(err); }
                                        }
                                        addBindBtn();
                                    }
                                } catch (err) {}
                            }, 1000);

                            var waitForCard = setInterval(() => {
                                timeoutWaitForCard++;
                                //console.log(timeoutWaitForCard);
                                if (timeoutWaitForCard > 100) {
                                    timeoutWaitForCard = 0;
                                    console.log('Timeout WaitForCard');
                                    clearInterval(waitForCard);
                                }
                                if (document.getElementsByClassName('btn btn-primary btn-group dropup').length > 0) {
                                    timeoutWaitForCard = 0;
                                    clearInterval(waitForCard);
                                    console.log('WaitForCard');
                                    let roleCards = document.getElementById('backpacks').children;
                                    let roleKeys = new Array();
                                    if (roleCards[0].className.indexOf('btn') != -1) { //清除已不存在的卡片的绑定信息
                                        for (let i = 0; i < roleCards.length; i++) {
                                            roleKeys.push(roleCards[i].getAttribute('onclick').match(/[0-9]+/)[0]);
                                        }
                                        let udata = getUserData();
                                        console.log(roleKeys);
                                        for (let key in udata.dataBind) {
                                            console.log(key);
                                            if (roleKeys.indexOf(key) == -1) {
                                                delete udata.dataBind[key];
                                            }
                                        }
                                        setUserData(udata);
                                    }
                                    observerCard.observe(document.getElementById('backpacks'), { childList: true });
                                }
                            }, 100);

                            break;
                        case 2:
                            $('.pop_main').hide();
                            btnc1.onclick = () => {
                                try {
                                    d.innerHTML = '<div class="pop_main">\n<div class="pop_con">\n<div class="pop_text">0</div>\n<a href="#">×</a>\n</div>\n<div class="mask"></div>\n</div>';
                                    $('.pop_con a').click(() => {
                                        $('.pop_con').animate({ 'top': 0, 'opacity': 0 }, () => {
                                            $('.pop_main').hide()
                                        })
                                    })
                                    $('.pop_main').show()
                                    $('.pop_con').css({ 'top': 0, 'opacity': 0 })
                                    $('.pop_con').animate({ 'top': '50%', 'opacity': 1 })
                                    let text = $('.pop_text');
                                    let aura = document.getElementsByClassName('btn btn-primary');
                                    let data = new Array();
                                    data.push(aura.length);

                                    for (let i = 0; i < aura.length; i++) {
                                        let t = aura[i].innerText;
                                        t = t.trim();
                                        switch (t[0]) {
                                            case '启':
                                                switch (t[3]) {
                                                    case '誓':
                                                        data.push('SHI');
                                                        break;
                                                    case '心':
                                                        data.push('XIN');
                                                        break;
                                                    case '风':
                                                        data.push('FENG');
                                                        break;
                                                }
                                                break;
                                            case '破':
                                                switch (t[1]) {
                                                    case '壁':
                                                        data.push('BI');
                                                        break;
                                                    case '魔':
                                                        data.push('MO');
                                                        break;
                                                }
                                                break;
                                            case '复':
                                                data.push('DUN');
                                                break;
                                            case '鲜':
                                                data.push('XUE');
                                                break;
                                            case '削':
                                                data.push('XIAO');
                                                break;
                                            case '伤':
                                                data.push('SHANG');
                                                break;
                                            case '精':
                                                data.push('SHEN');
                                                break;
                                            case '铁':
                                                data.push('CI');
                                                break;
                                            case '忍':
                                                data.push('REN');
                                                break;
                                            case '热':
                                                data.push('RE');
                                                break;
                                            case '点':
                                                data.push('DIAN');
                                                break;
                                            case '沸':
                                                data.push('FEI');
                                                break;
                                            case '波':
                                                data.push('BO');
                                                break;
                                            case '飓':
                                                data.push('JU');
                                                break;
                                            case '红':
                                                data.push('HONG');
                                                break;
                                            case '荧':
                                                data.push('JUE');
                                                break;
                                            case '后':
                                                data.push('HOU');
                                                break;
                                            default:
                                                data.push('NONE');
                                                break;
                                        }
                                    }
                                    text[0].innerText = `${data.join(' ')}`;
                                    //$('.pop_main').hide();

                                } catch (err) {
                                    console.log(err);
                                }
                            }
                            break;
                        case 3:
                            $('.pop_main').hide();
                            btnc1.onclick = () => {}
                            break;
                    }
                });
                observer.observe(document.getElementById('backpacks'), { childList: true, characterData: true });
            }
        }, 500);

        let p = document.getElementsByClassName('panel panel-primary')[1];
        p.insertBefore(btnc1, p.children[0]);

        let d = document.createElement('div');
        d.id = 'alert';
        d.innerHTML = '<div class="pop_main">\n<div class="pop_con">\n<div class="pop_text">0</div>\n<a href="#">×</a>\n</div>\n<div class="mask"></div>\n</div>';
        //'<div class="pop_main">\n<div class="pop_con">\n<div class="pop_text">0</div>\n<div class="pop_text">0</div>\n<div class="pop_text">0</div>\n<div class="pop_text">0</div>\n<div class="pop_text">Bag:</div>\n<div class="pop_text">0</div>\n<div class="pop_text">0</div>\n<div class="pop_text">0</div>\n<div class="pop_text">0</div>\n<div class="pop_text">0</div>\n<div class="pop_text">0</div>\n<div class="pop_text">0</div>\n<div class="pop_text">0</div>\n<div class="pop_text">0</div>\n<div class="pop_text">0</div>\n<div class="pop_text">0</div>\n<div class="pop_text">0</div>\n<div class="pop_text">0</div>\n<div class="pop_text">0</div>\n<a href="#">×</a>\n</div>\n<div class="mask"></div>\n</div>';

        p.insertBefore(d, p.children[0]);
        $('.pop_main').hide();
        $('.pop_con a').click(() => {
            $('.pop_con').animate({ 'top': 0, 'opacity': 0 }, () => {
                $('.pop_main').hide()
            })
        })
    } else if (window.location.pathname == '/fyg_beach.php') {
        function insertAfter(newEl, targetEl) {
            var parentEl = targetEl.parentNode;

            if (parentEl.lastChild == targetEl) {
                parentEl.appendChild(newEl);
            } else {
                parentEl.insertBefore(newEl, targetEl.nextSibling);
            }
        }

        let beachCheck = document.createElement('form');
        beachCheck.innerHTML = `<div class="form-group form-check">
    <label class="form-check-label" for="beachcheck">屏蔽垃圾装备</label>
    <input type="checkbox" class="form-check-input" id="beachcheck">
    <label>分析中..</label>
    <button button type="button" onclick="siftSetting()">筛选设置</button>
  </div>`;
        document.getElementsByClassName('panel panel-primary')[2].insertBefore(beachCheck, document.getElementsByClassName('panel panel-primary')[2].children[1]);
        document.querySelector("#beachcheck").addEventListener('click', () => { localStorage.setItem('beachcheck', document.querySelector("#beachcheck").checked) }, false);
        document.querySelector("#beachcheck").checked = (localStorage.getItem('beachcheck') == 'true');

        let popStyle = `<style>
        .popup {
            width: 100vw;
            height: 100vh;
            background-color: rgba(0, 0, 0, .5);
            position: fixed;
            left: 0;
            top: 0;
            bottom: 0;
            right: 0;
            z-index: 9999;
            display: none;
            justify-content: center;
            align-items: center;
        }

        .popup-content {
            width: 400px;
            height: 200px;
            background-color: #fff;
            box-sizing: border-box;
            padding: 10px 30px;
            color: black;
        }

        .topline {
            width: 100%;
            border-bottom: 1px solid black;
        }
    </style>`;
        let divSetting = document.createElement('div');
        divSetting.setAttribute('id', 'siftpage_pop');

        let eqs = new Array(fullName.slice(0, sortdict.BOUND_0), fullName.slice(sortdict.BOUND_0 + 1, sortdict.BOUND_1), fullName.slice(sortdict.BOUND_1 + 1, sortdict.BOUND_2), fullName.slice(sortdict.BOUND_2 + 1));

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < eqs[i].length; j++) {
                eqs[i][j] = `
                <span class="dropdown dropdown-hover">
  <button class="btn" type="button" id="btn${eqToAbbr(eqs[i][j])}" data-toggle="dropdown">${eqs[i][j]} <span class="caret"></span></button>
  <ul class="dropdown-menu">
    <li><a href="javascript:void(0)" class="attri_item">属性1</a></li>
    <li><a href="javascript:void(0)" class="attri_item">属性2</a></li>
    <li><a href="javascript:void(0)" class="attri_item">属性3</a></li>
    <li><a href="javascript:void(0)" class="attri_item">属性4</a></li>
  </ul>
</span>
                <input type="checkbox" class="form-check-input siftsetting" id="${eqToAbbr(eqs[i][j])}">&nbsp;`;
            }
        }


        let initSettingHTML = `<div class="popup-content">
        <div class="topline">
            <p></p>
            <form><div class="form-group form-check">
    ${eqs[0]}
</div></form>
        </div>
        <div class="topline">
            <p></p>
            <form><div class="form-group form-check">
    ${eqs[1]}
</div></form>
        </div>
        <div class="topline">
            <p></p>
            <form><div class="form-group form-check">
    ${eqs[2]}
</div></form>
        </div>
        <div class="topline">
            <p></p>
            <form><div class="form-group form-check">
    ${eqs[3]}
</div></form>
        </div>
        <p></p>
        <p style="color:red">勾选的装备不会被拾取，有神秘除外</p>
        <p style="color:red">勾选的属性不会被对比，即此条属性大于已有装备也不会被拾取，即忽略无用属性</p>
        <button type="button" onclick="exitSift()">完成</button>
    </div>`;

        divSetting.innerHTML = `${popStyle}
<div class="popup" id="siftpop">
${initSettingHTML}
</div>`;
        unsafeWindow.siftSetting = function() {
            $('.popup-content').height(Math.min(fullName.length, 19) * 10 + 200);
            $('.popup-content').width(700);
            $('.popup-content').css('overflow', 'scroll');

            function selector_sift() {
                //console.log($(this).text()[0]);
                if ($(this).text()[0] != '✔') {
                    $(this).text('✔' + $(this).text());
                } else {
                    $(this).text($(this).text().slice(1));
                }
            }
            $('.attri_item').each(function(i, e) {
                $(e).on('click', selector_sift);
            });

            $('.attri_item').hover(
                function() {
                    $(this).css({ 'color': '#fff', 'background-color': '#3280fc' });
                },
                function() {
                    $(this).css({ 'color': '#000', 'background-color': '#fff' });
                });

            let eqchecks = document.getElementsByClassName('form-check-input siftsetting');
            let ud = getUserData();
            for (let i = 0; i < eqchecks.length; i++) {
                if (ud.dataBeachSift == null) {
                    ud.dataBeachSift = { "PLATE": "true,false,false,false,false", "LEATHER": "true,false,false,false,false", "CLOTH": "true,false,false,false,false" };
                    setUserData(ud);
                } else {
                    if (ud.dataBeachSift[eqchecks[i].id] != null) {
                        let s = ud.dataBeachSift[eqchecks[i].id].split(',');
                        eqchecks[i].checked = (s[0] == 'true');
                        let attri = eqchecks[i].previousSibling.previousSibling.children[1].children;
                        for (let i = 0; i < attri.length; i++) {
                            if (s[1 + i] == 'true') {
                                attri[i].children[0].innerText = '✔' + attri[i].children[0].innerText;
                            }

                        }
                    }
                }
            }
            document.getElementById('siftpop').style.display = 'flex';
        }

        unsafeWindow.exitSift = function() {
            let eqchecks = document.getElementsByClassName('form-check-input siftsetting');
            let ud = getUserData();
            for (let i = 0; i < eqchecks.length; i++) {
                let checklist = eqchecks[i].previousSibling.previousSibling.children[1].innerText.split('\n')
                let checkres = new Array(eqchecks[i].checked, false, false, false, false);
                for (let i = 0, j = 1; i < checklist.length; i++) {
                    if (checklist[i].replace(/\s+/g, '').length > 0) {
                        if (checklist[i].replace(/\s+/g, '')[0] == '✔') {
                            checkres[j] = true;
                            j++;
                        } else if (checklist[i].replace(/\s+/g, '')[0] == '属') {
                            checkres[j] = false;
                            j++;
                        }
                    }

                }
                ud.dataBeachSift[eqchecks[i].id] = `${checkres}`;
            }
            setUserData(ud);
            document.getElementById('siftpop').style.display = 'none';
            document.getElementById('siftpop').innerHTML = initSettingHTML;
        }

        let p2 = document.getElementsByClassName('panel panel-primary')[2];
        if (p2.lastChild.id != 'siftpage_pop') {
            p2.appendChild(divSetting);
        }

        let divAmulet = document.createElement('div');
        divAmulet.setAttribute('id', 'amuletpage_pop');

        let initAmuletHTML = `<div class="popup-content">
        <div class="topline">
            <p></p>
        </div>
        <button type="button" onclick="exitAmulet()">取消</button>
        <button type="button" disabled="disabled" onclick="goAmulet()">继续</button>
        <span>请稍候..</span>
        </div>`;

        divAmulet.innerHTML = `${popStyle}
        <div class="popup" id="amuletpop">
        ${initAmuletHTML}
        </div>`;

        let toAmuletExit = false;
        let continueAmulet = true;

        unsafeWindow.exitAmulet = function() {
            toAmuletExit = true;
            document.getElementById('amuletpop').style.display = 'none';
            document.getElementById('amuletpop').innerHTML = initAmuletHTML;
        }

        unsafeWindow.goAmulet = function() {
            continueAmulet = true;
        }

        let p1 = document.getElementsByClassName('panel panel-primary')[1];
        if (p1.lastChild.id != 'amuletpage_pop') {
            p1.appendChild(divAmulet);
        }

        let batbtns = document.getElementsByClassName('panel-body')[1].children[0];
        let toAmuletBtn = document.createElement('button');
        toAmuletBtn.className = 'btn btn-danger';
        toAmuletBtn.innerText = '批量沙滩转护符(背包至少留一个空位)';
        let _amuletsID = new Array();
        let _equipmentsID = new Array();
        let _pickID = new Array();
        let _safeid = null;
        let _next = -1;
        let waitForContinue = null;
        toAmuletBtn.onclick = () => {
            _amuletsID = new Array();
            _equipmentsID = new Array();
            _pickID = new Array();
            _safeid = null;
            _next = -1;
            waitForContinue = null;
            toAmuletExit = false;
            continueAmulet = true;
            let bagItems = document.querySelector("#backpacks").children;
            if (bagItems != null && bagItems.length > 2 && confirm('确定要把沙滩所有装备转换成护符吗？')) {

                for (let i = 0; i < bagItems.length; i++) {
                    if (bagItems[i].className.split(' ').length == 3 && bagItems[i].innerText.indexOf('+') != -1) {
                        _amuletsID.push(bagItems[i].getAttribute('onclick').match(/'[0-9]+'/)[0].slice(1, -1));
                    } else if (bagItems[i].className.split(' ').length == 3 && bagItems[i].innerText.indexOf('+') == -1) {
                        _equipmentsID.push(bagItems[i].getAttribute('onclick').match(/'[0-9]+'/)[0].slice(1, -1));
                    }
                }

                let btns = document.getElementsByClassName('fyg_mp3');
                for (let i = 0; i < btns.length; i++) {
                    if (btns[i].parentNode.id == 'beachall' && btns[i].className.indexOf('btn') != -1) {
                        let rare = btns[i].className.split(' ')[1];
                        if (rare != 'fyg_colpz01bg' && rare != 'fyg_colpz02bg') {
                            _pickID.push(btns[i].getAttribute('onclick').match(/\([0-9]+\)/)[0].slice(1, -1))
                        }
                    }
                }

                _safeid = getPostData(/sttz\(\)\{[\s\S]*\}/m, /data: ".*"/).slice(12, -1);
                console.log(_equipmentsID);
                console.log(_amuletsID);
                console.log(_pickID);
                console.log(_safeid);

                let amuletBlock = document.getElementById('amuletpop').children[0].children[0];
                let btnExit = document.getElementById('amuletpop').children[0].children[1];
                let btnContinue = document.getElementById('amuletpop').children[0].children[2];
                let infospan = document.getElementById('amuletpop').children[0].children[3];

                function showAmuletPop() {
                    $('.popup-content').height(Math.min(_pickID.length, 19) * 10 + 200);
                    $('.popup-content').width(700);
                    $('.popup-content').css('overflow', 'scroll');

                    document.getElementById('amuletpop').style.display = 'flex';
                }

                unsafeWindow.destroyAmulet = (e) => {
                    let btn = e.parentNode.parentNode.parentNode;
                    let id = btn.getAttribute('id');
                    let pirlam_data = `c=9&id=${id}&yz=124&${_safeid}`;
                    GM_xmlhttpRequest({ //pirl(id)
                        method: 'POST',
                        url: `https://www.guguzhen.com/fyg_click.php`,
                        headers: headersPOST,
                        data: pirlam_data,
                        onload: response => {
                            console.log(response.responseText.indexOf('水'));
                            if (response.responseText.indexOf('水') != -1) {
                                GM_xmlhttpRequest({ //read
                                    method: 'POST',
                                    url: `https://www.guguzhen.com/fyg_read.php`,
                                    headers: headersPOST,
                                    data: `f=2`,
                                    onload: response => {
                                        _amuletsID.splice(_amuletsID.indexOf(id), 1);
                                        btn.parentNode.removeChild(btn);
                                        console.log('core +1');
                                    }
                                });
                            } else {
                                console.log(`except at destroy: ${response.responseText}`);
                            }
                        }
                    });
                }

                unsafeWindow.storeAmulet = (e) => {
                    let btn = e.parentNode.parentNode.parentNode;
                    let id = btn.getAttribute('id');
                    let pirlam_data = `c=21&id=${id}&${_safeid}`;
                    console.log(pirlam_data);
                    GM_xmlhttpRequest({ //puti(id)
                        method: 'POST',
                        url: `https://www.guguzhen.com/fyg_click.php`,
                        headers: headersPOST,
                        data: pirlam_data,
                        onload: response => {
                            if (response.responseText == 'ok') {
                                GM_xmlhttpRequest({ //read
                                    method: 'POST',
                                    url: `https://www.guguzhen.com/fyg_read.php`,
                                    headers: headersPOST,
                                    data: `f=2`,
                                    onload: response => {
                                        _amuletsID.splice(_amuletsID.indexOf(id), 1);
                                        btn.parentNode.removeChild(btn);
                                    }
                                });
                            } else {
                                console.log(`except at store: ${response.responseText}`);
                                alert('仓库已满');
                            }
                        }
                    });
                }

                showAmuletPop();

                function toAmulet(count, equipmentsID, amuletsID, pickID, safeid) {
                    infospan.innerText = '请稍候..';
                    btnContinue.disabled = 'disabled';
                    if (count == 0) {
                        infospan.innerText = '';
                        btnExit.innerText = '完成';
                        return;
                    }
                    if (toAmuletExit) {
                        console.log('toAmuletExit');
                        return;
                    }
                    let stpick_data = `c=1&id=${pickID[count-1]}&${safeid}`;
                    GM_xmlhttpRequest({ //pick equipment
                        method: 'POST',
                        url: `https://www.guguzhen.com/fyg_click.php`,
                        headers: headersPOST,
                        data: stpick_data,
                        onload: response => {
                            if (toAmuletExit) {
                                console.log('toAmuletExit');
                                return;
                            }
                            if (response.responseText != 'ok') {
                                console.log(`fullbag: ${response.responseText}`);
                                infospan.innerText = '背包已满，请处理后继续';
                                btnContinue.disabled = '';
                                continueAmulet = false;
                                _next = count;
                                _equipmentsID = equipmentsID;
                                _amuletsID = amuletsID;
                                _pickID = pickID;
                                _safeid = safeid;
                                waitForContinue = setInterval(() => {
                                    // $('.amulet_menu').bind('click', () => {
                                    //     let id = $(this).parent().parent().parent().attr('id');
                                    //     console.log(`splice: ${id}`);
                                    //     _amuletsID.splice(_amuletsID.indexOf(id), 1);
                                    // });
                                    if (continueAmulet) {
                                        clearInterval(waitForContinue);
                                        toAmulet(_next, _equipmentsID, _amuletsID, _pickID, _safeid);
                                    } else if (toAmuletExit) {
                                        console.log('toAmuletExit');
                                        clearInterval(waitForContinue);
                                    }
                                }, 200);
                                //alert('背包已满，请处理后继续');
                                return;
                            }
                            GM_xmlhttpRequest({ //find eqid
                                method: 'POST',
                                url: `https://www.guguzhen.com/fyg_read.php`,
                                headers: headersPOST,
                                data: 'f=2',
                                onload: response => {
                                    if (toAmuletExit) {
                                        console.log('toAmuletExit');
                                        return;
                                    }
                                    let eqid = null;
                                    let bagdiv = document.createElement('div');
                                    bagdiv.innerHTML = response.responseText;
                                    for (let i = 0; i < bagdiv.children.length; i++) {
                                        if (bagdiv.children[i].className.split(' ').length == 3 && bagdiv.children[i].innerText.indexOf('+') == -1) {
                                            eqid = bagdiv.children[i].getAttribute('onclick').match(/'[0-9]+'/)[0].slice(1, -1);
                                            if (equipmentsID.length == 0 || equipmentsID.indexOf(eqid) == -1) {
                                                break;
                                            } else {
                                                eqid = null;
                                            }
                                        }
                                    }
                                    console.log(`eqid: ${eqid}`);
                                    let pirleq_data = `c=9&id=${eqid}&yz=124&${safeid}`;
                                    GM_xmlhttpRequest({ //pirl(id)
                                        method: 'POST',
                                        url: `https://www.guguzhen.com/fyg_click.php`,
                                        headers: headersPOST,
                                        data: pirleq_data,
                                        onload: response => {
                                            console.log(response.responseText);
                                            if (toAmuletExit) {
                                                console.log('toAmuletExit');
                                                return;
                                            }
                                            GM_xmlhttpRequest({ //find amid
                                                method: 'POST',
                                                url: `https://www.guguzhen.com/fyg_read.php`,
                                                headers: headersPOST,
                                                data: 'f=2',
                                                onload: response => {
                                                    if (toAmuletExit) {
                                                        console.log('toAmuletExit');
                                                        return;
                                                    }
                                                    let amid = null;
                                                    let bagdiv = document.createElement('div');
                                                    bagdiv.innerHTML = response.responseText;
                                                    for (let i = 0; i < bagdiv.children.length; i++) {
                                                        if (bagdiv.children[i].className.split(' ').length == 3 && bagdiv.children[i].innerText.indexOf('+') != -1) {
                                                            amid = bagdiv.children[i].getAttribute('onclick').match(/'[0-9]+'/)[0].slice(1, -1);
                                                            if (amuletsID.length == 0 || amuletsID.indexOf(amid) == -1) {
                                                                console.log(bagdiv.children[i]);
                                                                let btn0 = document.createElement('div');
                                                                btn0.setAttribute('class', 'btn-group');
                                                                btn0.setAttribute('id', amid);
                                                                btn0.innerHTML = `<button type="button" class="btn btn-light dropdown-toggle" data-toggle="dropdown" style="padding: 0px; text-align: left; box-shadow: none; line-height: 90%;">
                                                                <div class="popover-content-show" style="padding: 10px 10px 0px;">${bagdiv.children[i].dataset.content}</div>
                                                                <span class="caret"></span>
                                                                </button>

                                                                <ul class="dropdown-menu" role="menu">
                                                                    <li><a class="amulet_menu" href="javascript:void(0);" style="background-color:#FF8C00" onclick="destroyAmulet(this)">销毁</a></li>
                                                                    <li><a class="amulet_menu" href="javascript:void(0);" style="background-color:#00CED1" onclick="storeAmulet(this)">入库</a></li>
                                                                </ul>`;

                                                                amuletBlock.appendChild(btn0);
                                                                amuletsID.push(amid);
                                                                break;
                                                            } else {
                                                                amid = null;
                                                            }
                                                        }
                                                    }
                                                    console.log(`amid: ${amid}`);
                                                    toAmulet(count - 1, equipmentsID, amuletsID, pickID, safeid);
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
                toAmulet(_pickID.length, _equipmentsID, _amuletsID, _pickID, _safeid);
            }
        }
        batbtns.appendChild(toAmuletBtn);

        let equipment = new Array();
        let equipedbtn = null;
        //读取拥有的装备
        GM_xmlhttpRequest({
            method: 'POST',
            url: `https://www.guguzhen.com/fyg_read.php`,
            headers: headersPOST,
            data: 'f=7',
            onload: response => {
                let div0 = readEquipmentDOM(response.responseText);

                for (let i = div0.children.length - 1; i >= 0; i--) {
                    if (div0.children[i].className.split(' ').length != 3 || div0.children[i].innerText.indexOf('+') != -1) {
                        div0.removeChild(div0.children[i]);
                    }
                }
                // console.log(div0);
                equipedbtn = [].slice.call(div0.children);
                let equipbag = getEquipmentInfo(div0.children);

                GM_xmlhttpRequest({
                    method: 'POST',
                    url: `https://www.guguzhen.com/fyg_read.php`,
                    headers: headersPOST,
                    data: 'f=9',
                    onload: response => {
                        document.querySelector(".form-check").children[2].innerText = '';
                        let div0 = document.createElement('div');
                        div0.innerHTML = response.responseText;

                        equipedbtn = equipedbtn.concat([].slice.call(div0.getElementsByClassName('fyg_tc')[3].children));
                        equipedbtn.sort(sortEqByName);

                        let equiped = getEquipmentInfo(div0.getElementsByClassName('fyg_tc')[3].children);
                        equipment = equipbag.concat(equiped);
                        if (equipment.length == 0) {
                            equipment[0] = -1;
                        }
                    }
                });
            }
        });

        //分析装备并显示属性
        function pickEquipment(equipment) {
            if (document.querySelector("#beachcheck").checked) {
                //屏蔽鼠标事件
                $('#beachall .fyg_mp3').css('pointer-events', 'none');
            } else {
                $('#beachall .fyg_mp3').css('pointer-events', 'auto');
            }
            if (equipment[0] == -1) return;
            let btns = document.getElementsByClassName('fyg_mp3');

            let udata = getUserData();
            if (udata.dataBeachSift == null) {
                udata.dataBeachSift = { "PLATE": "true,false,false,false,false", "LEATHER": "true,false,false,false,false", "CLOTH": "true,false,false,false,false" };
                setUserData(udata);
            }

            for (let i = 0; i < btns.length; i++) {
                if (btns[i].parentNode.id == 'beachall' && btns[i].className.indexOf('btn') != -1) {
                    let isFind = false;
                    let isPick = false;
                    let sift = new Array(5).fill('false')
                    let btninfo = getEquipmentInfo(new Array(btns[i]))[0];
                    if (udata.dataBeachSift != null && udata.dataBeachSift[btninfo[0]] != null) {
                        sift = udata.dataBeachSift[btninfo[0]].split(',');
                    }

                    if (btninfo[6] == 1) {
                        //神秘必捡
                        isPick = true;
                    } else if (sift[0] == 'true') {
                        //筛选设置不捡
                        isPick = false;
                    } else {
                        for (let j = 0; j < equipment.length; j++) {
                            if (equipment[j][0] == btninfo[0]) {
                                isFind = true;
                                let e1 = new Array(parseInt(equipment[j][1]), parseInt(equipment[j][2]), parseInt(equipment[j][3]), parseInt(equipment[j][4]), parseInt(equipment[j][5]));
                                let e2 = new Array(parseInt(btninfo[1]), parseInt(btninfo[2]), parseInt(btninfo[3]), parseInt(btninfo[4]), parseInt(btninfo[5]));

                                function product(e1, e2) {
                                    return e1 * e2;
                                }

                                function linear(e1, e2, a, b) {
                                    return (e1 / a + b) * e2;
                                }
                                let comp = new Array(false, false, false, false);

                                switch (btninfo[0]) {
                                    case 'BLADE':
                                        comp[0] = linear(e1[0], e1[1], 5, 20) < linear(e2[0], e2[1], 5, 20);
                                        comp[1] = linear(e1[0], e1[2], 5, 20) < linear(e2[0], e2[2], 5, 20);
                                        comp[2] = linear(e1[0], e1[3], 20, 10) < linear(e2[0], e2[3], 20, 10);
                                        comp[3] = linear(e1[0], e1[4], 20, 10) < linear(e2[0], e2[4], 20, 10);
                                        break;
                                    case 'STAFF':
                                        comp[0] = product(e1[0], e1[1]) < product(e2[0], e2[1]);
                                        comp[1] = product(e1[0], e1[2]) < product(e2[0], e2[2]);
                                        comp[2] = linear(e1[0], e1[3], 20, 5) < linear(e2[0], e2[3], 20, 5);
                                        comp[3] = linear(e1[0], e1[4], 15, 10) < linear(e2[0], e2[4], 15, 10);
                                        break;
                                    case 'WAND':
                                        comp[0] = product(e1[0], e1[1]) < product(e2[0], e2[1]);
                                        comp[1] = product(e1[0], e1[2]) < product(e2[0], e2[2]);
                                        comp[2] = product(e1[0], e1[3]) < product(e2[0], e2[3]);
                                        comp[3] = product(e1[0], e1[4]) < product(e2[0], e2[4]);
                                        break;
                                    case 'SWORD':
                                        comp[0] = product(e1[0], e1[1]) < product(e2[0], e2[1]);
                                        comp[1] = product(e1[0], e1[2]) < product(e2[0], e2[2]);
                                        comp[2] = product(e1[0], e1[3]) < product(e2[0], e2[3]);
                                        comp[3] = linear(e1[0], e1[4], 15, 10) < linear(e2[0], e2[4], 15, 10);
                                        break;
                                    case 'CLAYMORE':
                                        comp[0] = product(e1[0], e1[1]) < product(e2[0], e2[1]);
                                        comp[1] = product(e1[0], e1[2]) < product(e2[0], e2[2]);
                                        comp[2] = linear(e1[0], e1[3], 5, 30) < linear(e2[0], e2[3], 5, 30);
                                        comp[3] = linear(e1[0], e1[4], 20, 1) < linear(e2[0], e2[4], 20, 1);
                                        break;
                                    case 'SHIELD':
                                        comp[0] = linear(e1[0], e1[1], 15, 10) < linear(e2[0], e2[1], 15, 10);
                                        comp[1] = product(e1[0], e1[2]) < product(e2[0], e2[2]);
                                        comp[2] = product(e1[0], e1[3]) < product(e2[0], e2[3]);
                                        comp[3] = product(e1[0], e1[4]) < product(e2[0], e2[4]);
                                        break;
                                    case 'BOW':
                                        comp[0] = product(e1[0], e1[1]) < product(e2[0], e2[1]);
                                        comp[1] = product(e1[0], e1[2]) < product(e2[0], e2[2]);
                                        comp[2] = product(e1[0], e1[3]) < product(e2[0], e2[3]);
                                        comp[3] = linear(e1[0], e1[4], 15, 10) < linear(e2[0], e2[4], 15, 10);
                                        break;
                                    case 'ASSBOW':
                                        comp[0] = linear(e1[0], e1[1], 5, 30) < linear(e2[0], e2[1], 5, 30);
                                        comp[1] = linear(e1[0], e1[2], 20, 10) < linear(e2[0], e2[2], 20, 10);
                                        comp[2] = linear(e1[0], e1[3], 20, 10) < linear(e2[0], e2[3], 20, 10);
                                        comp[3] = product(e1[0], e1[4]) < product(e2[0], e2[4]);
                                        break;
                                    case 'DAGGER':
                                        comp[0] = linear(e1[0], e1[1], 5, 0) < linear(e2[0], e2[1], 5, 0);
                                        comp[1] = linear(e1[0], e1[2], 5, 0) < linear(e2[0], e2[2], 5, 0);
                                        comp[2] = product(e1[0], e1[3]) < product(e2[0], e2[3]);
                                        comp[3] = linear(e1[0], e1[4], 5, 25) < linear(e2[0], e2[4], 5, 25);
                                        break;
                                    case 'GLOVES':
                                        comp[0] = product(e1[0], e1[1]) < product(e2[0], e2[1]);
                                        comp[1] = product(e1[0], e1[2]) < product(e2[0], e2[2]);
                                        comp[2] = product(e1[0], e1[3]) < product(e2[0], e2[3]);
                                        comp[3] = product(e1[0], e1[4]) < product(e2[0], e2[4]);
                                        break;
                                    case 'BRACELET':
                                        comp[0] = linear(e1[0], e1[1], 5, 1) < linear(e2[0], e2[1], 5, 1);
                                        comp[1] = linear(e1[0], e1[2], 20, 1) < linear(e2[0], e2[2], 20, 1);
                                        comp[2] = product(e1[0], e1[3]) < product(e2[0], e2[3]);
                                        comp[3] = product(e1[0], e1[4]) < product(e2[0], e2[4]);
                                        break;
                                    case 'VULTURE':
                                        comp[0] = linear(e1[0], e1[1], 15, 5) < linear(e2[0], e2[1], 15, 5);
                                        comp[1] = linear(e1[0], e1[2], 15, 5) < linear(e2[0], e2[2], 15, 5);
                                        comp[2] = linear(e1[0], e1[3], 15, 5) < linear(e2[0], e2[3], 15, 5);
                                        comp[3] = product(e1[0], e1[4]) < product(e2[0], e2[4]);
                                        break;
                                    case 'CLOAK':
                                        comp[0] = product(e1[0], e1[1]) < product(e2[0], e2[1]);
                                        comp[1] = product(e1[0], e1[2]) < product(e2[0], e2[2]);
                                        comp[2] = linear(e1[0], e1[3], 5, 25) < linear(e2[0], e2[3], 5, 25);
                                        comp[3] = product(e1[0], e1[4]) < product(e2[0], e2[4]);
                                        break;
                                    case 'CLOTH':
                                        isPick = false;
                                        break;
                                    case 'LEATHER':
                                        isPick = false;
                                        break;
                                    case 'PLATE':
                                        isPick = false;
                                        break;
                                    case 'THORN':
                                        comp[0] = linear(e1[0], e1[1], 5, 20) < linear(e2[0], e2[1], 5, 20);
                                        comp[1] = product(e1[0], e1[2]) < product(e2[0], e2[2]);
                                        comp[2] = product(e1[0], e1[3]) < product(e2[0], e2[3]);
                                        comp[3] = linear(e1[0], e1[4], 15, 10) < linear(e2[0], e2[4], 15, 10);
                                        break;
                                    case 'SCARF':
                                        comp[0] = product(e1[0], e1[1]) < product(e2[0], e2[1]);
                                        comp[1] = product(e1[0], e1[2]) < product(e2[0], e2[2]);
                                        comp[2] = product(e1[0], e1[3]) < product(e2[0], e2[3]);
                                        comp[3] = product(e1[0], e1[4]) < product(e2[0], e2[4]);
                                        break;
                                    case 'TIARA':
                                        comp[0] = product(e1[0], e1[1]) < product(e2[0], e2[1]);
                                        comp[1] = linear(e1[0], e1[2], 3, 1) < linear(e2[0], e2[2], 3, 1);
                                        comp[2] = product(e1[0], e1[3]) < product(e2[0], e2[3]);
                                        comp[3] = product(e1[0], e1[4]) < product(e2[0], e2[4]);
                                        break;
                                    case 'RIBBON':
                                        comp[0] = product(e1[0], e1[1]) < product(e2[0], e2[1]);
                                        comp[1] = product(e1[0], e1[2]) < product(e2[0], e2[2]);
                                        comp[2] = product(e1[0], e1[3]) < product(e2[0], e2[3]);
                                        comp[3] = product(e1[0], e1[4]) < product(e2[0], e2[4]);
                                        break;
                                }

                                isPick = (
                                    sift[1] == 'false' && comp[0] ||
                                    sift[2] == 'false' && comp[1] ||
                                    sift[3] == 'false' && comp[2] ||
                                    sift[4] == 'false' && comp[3]);

                                if (isPick) {
                                    break;
                                }
                            }
                        }
                        if (!isFind) {
                            isPick = true;
                        }
                    }


                    if (isPick) {
                        let btn0 = document.createElement('button');
                        btn0.setAttribute('class', 'btn btn-light');
                        btn0.setAttribute('onclick', btns[i].getAttribute('onclick'));
                        btn0.setAttribute('data-toggle', 'popover');
                        btn0.setAttribute('data-trigger', 'hover');
                        btn0.setAttribute('data-placement', 'left');
                        btn0.setAttribute('data-html', 'true');
                        let popover = document.createElement('div');
                        popover.innerHTML = `<style>.popover{max-width:360px}</style>`
                        for (let eqbtn of equipedbtn) {
                            if (sortdict[eqToAbbr(btns[i].dataset.originalTitle.split(' ')[2])] == parseInt(eqbtn.getAttribute('data-abbr'))) {
                                let btn1 = document.createElement('button');
                                btn1.setAttribute('class', 'btn btn-light');
                                btn1.style.cssText = 'padding:10px 5px 0px 5px;text-align:left;box-shadow:none;background-color:none;line-height:100%';
                                btn1.innerHTML = eqbtn.dataset.content;
                                if (btn1.lastChild.nodeType == 3) { //清除背景介绍文本
                                    btn1.lastChild.remove();
                                }
                                if (btn1.lastChild.className.indexOf('bg-danger') != -1) {
                                    btn1.lastChild.style.cssText = 'padding:0;max-width:160px;white-space:pre-line;word-break:break-all;line-height:110%';
                                }
                                popover.appendChild(btn1);
                            }
                        }
                        btn0.setAttribute('data-content', popover.innerHTML);
                        btn0.innerHTML = `<h3 class="popover-title" style="color:white;background-color: ${getComputedStyle(btns[i]).getPropertyValue("background-color")}">${btns[i].dataset.originalTitle}</h3><div class="popover-content-show">${btns[i].dataset.content}</div>`;
                        insertAfter(btn0, btns[i]);
                    }
                }
            }
            $(function() {
                $('[data-toggle="popover"]').popover();
            });
            $('.popover-content-show').css({
                'padding': '10px 10px 0px 10px'
            });
            $('.btn-light').css({
                'padding': 0,
                'text-align': 'left',
                'box-shadow': 'none',
                'background-color': 'none',
                'line-height': '90%'
            });
            $('.bg-danger').css({
                'padding': '5px 5px 5px 5px',
                'max-width': '200px',
                'white-space': 'pre-line',
                'word-break': 'break-all',
                'line-height': '110%'
            });
        }

        //等待海滩装备加载
        let show = setInterval(() => {
            if ($('#beachall .fyg_mp3').toArray().length != 0) {
                clearInterval(show);
                //等待装备读取完成
                let pick = setInterval(() => {
                    if (equipment.length > 0) {
                        clearInterval(pick);
                        pickEquipment(equipment);
                    }
                }, 500);
            }
        }, 500);

        function getBeachBtnNum() {
            let eqbtns = $('#beachall .fyg_mp3').toArray();
            let num = 0;
            for (let i = 0; i < eqbtns.length; i++) {
                if (eqbtns[i].className.indexOf('btn') != -1) {
                    num++;
                }
            }
            return num;
        }

        let btnNum = -1;
        let initBtnNum = setInterval(() => {
            if ($('#beachall .fyg_mp3').toArray().length > 0) {
                clearInterval(initBtnNum);
                btnNum = getBeachBtnNum();
                //console.log(`be:${btnNum}`);
            }
        }, 2000);

        let observerBody0 = new MutationObserver(() => {
            let nowlength = getBeachBtnNum();
            //console.log(`be:${btnNum},${nowlength}`);
            if (btnNum != -1 && btnNum != nowlength) { //海滩装备数量发生改变
                //console.log(`${btnNum},${nowlength}`);
                btnNum = nowlength;
                //等待海滩状态刷新
                let readd = setInterval(() => {
                    if ($('#beachall .btn btn-light').toArray().length == 0) {
                        clearInterval(readd);
                        pickEquipment(equipment);
                    }
                }, 1000);
            }
        }, 1000);
        observerBody0.observe(document.getElementsByClassName('panel panel-primary')[2], { childList: true, subtree: true, });
    } else if (window.location.pathname == '/fyg_pk.php') {
        let btngroup0 = document.createElement('div');
        btngroup0.setAttribute('class', 'action_selector');
        btngroup0.innerHTML = `<p></p><div class="btn-group" role="group">
  <button type="button" class="btn btn-secondary">0</button>
  <button type="button" class="btn btn-secondary">10</button>
  <button type="button" class="btn btn-secondary">20</button>
  <button type="button" class="btn btn-secondary">30</button>
  <button type="button" class="btn btn-secondary">40</button>
  <button type="button" class="btn btn-secondary">50</button>
  <button type="button" class="btn btn-secondary">60</button>
  <button type="button" class="btn btn-secondary">70</button>
  <button type="button" class="btn btn-secondary">80</button>
  <button type="button" class="btn btn-secondary">90</button>
  <button type="button" class="btn btn-secondary">100</button>
</div>`;
        let btngroup1 = document.createElement('div');
        btngroup1.setAttribute('class', 'action_selector');
        btngroup1.innerHTML = `<p></p><div class="btn-group" role="group">
  <button type="button" class="btn btn-secondary">0</button>
  <button type="button" class="btn btn-secondary">5</button>
  <button type="button" class="btn btn-secondary">10</button>
  <button type="button" class="btn btn-secondary">15</button>
  <button type="button" class="btn btn-secondary">20</button>
  <button type="button" class="btn btn-secondary">25</button>
  <button type="button" class="btn btn-secondary">30</button>
  <button type="button" class="btn btn-secondary">35</button>
  <button type="button" class="btn btn-secondary">40</button>
  <button type="button" class="btn btn-secondary">45</button>
  <button type="button" class="btn btn-secondary">50</button>
  <button type="button" class="btn btn-secondary">55</button>
  <button type="button" class="btn btn-secondary">60</button>
  <button type="button" class="btn btn-secondary">65</button>
  <button type="button" class="btn btn-secondary">70</button>
  <button type="button" class="btn btn-secondary">75</button>
  <button type="button" class="btn btn-secondary">80</button>
  <button type="button" class="btn btn-secondary">85</button>
  <button type="button" class="btn btn-secondary">90</button>
  <button type="button" class="btn btn-secondary">95</button>
  <button type="button" class="btn btn-secondary">100</button>
</div>`;
        let btngroup2 = document.createElement('div');
        btngroup2.setAttribute('class', 'action_selector');
        btngroup2.innerHTML = `<p></p><div class="btn-group" role="group">
  <button type="button" class="btn btn-secondary">0</button>
  <button type="button" class="btn btn-secondary">5</button>
  <button type="button" class="btn btn-secondary">10</button>
  <button type="button" class="btn btn-secondary">15</button>
  <button type="button" class="btn btn-secondary">20</button>
  <button type="button" class="btn btn-secondary">25</button>
  <button type="button" class="btn btn-secondary">30</button>
  <button type="button" class="btn btn-secondary">35</button>
  <button type="button" class="btn btn-secondary">40</button>
  <button type="button" class="btn btn-secondary">45</button>
  <button type="button" class="btn btn-secondary">50</button>
  <button type="button" class="btn btn-secondary">55</button>
  <button type="button" class="btn btn-secondary">60</button>
  <button type="button" class="btn btn-secondary">65</button>
  <button type="button" class="btn btn-secondary">70</button>
  <button type="button" class="btn btn-secondary">75</button>
  <button type="button" class="btn btn-secondary">80</button>
  <button type="button" class="btn btn-secondary">85</button>
  <button type="button" class="btn btn-secondary">90</button>
  <button type="button" class="btn btn-secondary">95</button>
  <button type="button" class="btn btn-secondary">100</button>
</div>`;

        let observerBody0 = new MutationObserver(() => {
            //observerBody0.disconnect();
            if (document.getElementsByClassName('btn-secondary').length == 0) {
                let addbtn = setInterval(() => {
                    let col = document.querySelector("#pklist > div > div.col-md-8");
                    if (col != null) {
                        clearInterval(addbtn);
                        let obtns = document.getElementsByClassName('btn-block dropdown-toggle fyg_lh30');
                        col.insertBefore(btngroup0, obtns[0]);
                        col.insertBefore(btngroup1, obtns[1]);
                        col.insertBefore(btngroup2, obtns[2]);
                        if (document.getElementsByClassName('btn-outline-secondary').length == 0) {
                            if (localStorage.getItem('dataReward') == null) {
                                localStorage.setItem('dataReward', '{"sumShell":"0","sumExp":"0"}');
                            }

                            let ok = document.createElement('div');
                            ok.innerHTML = `<p></p><button type="button" class="btn btn-outline-secondary">任务执行</button>`;
                            col.appendChild(ok);

                            function gobattle() {
                                let times = new Array(0, 0, 0);
                                let sum = 0;
                                $(".btn-secondary").each(function(i, e) {
                                    if ($(e).attr("style") != null && $(e).css("background-color") == "rgb(135, 206, 250)") {
                                        let a = parseInt(e.innerText);
                                        let b = $(".btn-group .btn-secondary").index(e);
                                        sum += a;
                                        if (b < 11) {
                                            times[0] = a / 10;
                                        } else if (b >= 11 && b < 32) {
                                            times[1] = a / 5;
                                        } else if (b >= 32) {
                                            times[2] = a / 5;
                                        }
                                    }
                                });

                                if (sum <= parseInt(document.getElementsByClassName('fyg_colpz03')[0].innerText)) {
                                    let gox_data = getPostData(/gox\(\)\{[\s\S]*\}/m, /data: ".*"/).slice(7, -1);

                                    //let gox_data = document.getElementsByTagName('script')[2].innerText.match(/gox\(\)\{[\s\S]*\}/)[0].match(/data:\s*".*"/)[0].slice(7,-1);

                                    let dataReward = JSON.parse(localStorage.getItem('dataReward'));
                                    let sum0 = parseInt(dataReward.sumShell);
                                    let sum1 = parseInt(dataReward.sumExp);

                                    function func0(time) {
                                        if (time == 0) {
                                            if (times[0] != 0) {
                                                GM_xmlhttpRequest({
                                                    method: 'POST',
                                                    url: `https://www.guguzhen.com/fyg_read.php`,
                                                    headers: headersPOST,
                                                    data: 'f=12',
                                                    onload: response => {
                                                        let ap = response.responseText.match(/class="fyg_colpz03" style="font-size:32px;font-weight:900;">[0-9]+</)[0].match(/>[0-9]+</)[0].slice(1, -1);
                                                        document.getElementsByClassName('fyg_colpz03')[0].innerText = ap;
                                                        let rankp = response.responseText.match(/class="fyg_colpz02" style="font-size:32px;font-weight:900;">[0-9]+%</)[0].match(/[0-9]+%/)[0];
                                                        document.getElementsByClassName('fyg_colpz02')[0].innerText = rankp;
                                                        let div_sum = document.createElement('div');
                                                        div_sum.innerText = `贝壳总次数:经验总次数=${sum0}:${sum1}=${(sum0 == 0 || sum1 == 0) ? 'undefined' : (sum0 / sum1).toFixed(4)}`;
                                                        dataReward.sumShell = sum0;
                                                        dataReward.sumExp = sum1;
                                                        localStorage.setItem('dataReward', JSON.stringify(dataReward));
                                                        document.getElementsByClassName('btn-outline-secondary')[0].parentNode.appendChild(div_sum);
                                                        times[0] = 0;
                                                    }
                                                });
                                            }
                                            return;
                                        }
                                        GM_xmlhttpRequest({
                                            method: 'POST',
                                            url: `https://www.guguzhen.com/fyg_click.php`,
                                            headers: headersPOST,
                                            data: gox_data,
                                            onload: response => {
                                                if (response.responseText.slice(0, 2) == '获得') {
                                                    let info = response.responseText.slice(0, response.responseText.indexOf('<'));
                                                    let div_info = document.createElement('div');
                                                    div_info.innerText = info;
                                                    document.getElementsByClassName('btn-outline-secondary')[0].parentNode.appendChild(div_info);
                                                    if (info.indexOf('贝壳') != -1) {
                                                        sum0 += 1;
                                                    } else if (info.indexOf('经验') != -1) {
                                                        sum1 += 1;
                                                    }
                                                    func0(time - 1);
                                                } else {
                                                    let div_info = document.createElement('div');
                                                    div_info.innerText = '段位进度不足';
                                                    document.getElementsByClassName('btn-outline-secondary')[0].parentNode.appendChild(div_info);
                                                    func0(0);
                                                }
                                            }
                                        });
                                    }

                                    function func1(time) {
                                        if (time == 0) {
                                            times[1] = 0;
                                            return;
                                        }
                                        let observerPk = new MutationObserver((mutationsList, observer) => {
                                            let isPk = 0;
                                            for (let mutation of mutationsList) {
                                                if (mutation.type == 'childList') {
                                                    isPk = 1;
                                                    //console.log(targetNode.firstChild);
                                                }
                                            }
                                            if (isPk) {
                                                observerPk.disconnect();
                                                func1(time - 1);
                                            }
                                        });
                                        observerPk.observe(document.querySelector("#pk_text"), { characterData: true, childList: true });
                                        jgjg(1);
                                    }

                                    function func2(time) {
                                        if (time == 0) {
                                            times[2] = 0;
                                            return;
                                        }
                                        let observerPk = new MutationObserver((mutationsList, observer) => {
                                            let isPk = 0;
                                            for (let mutation of mutationsList) {
                                                if (mutation.type == 'childList') {
                                                    isPk = 1;
                                                    //console.log(targetNode.firstChild);
                                                }
                                            }
                                            if (isPk) {
                                                observerPk.disconnect();
                                                func2(time - 1);
                                            }
                                        });
                                        observerPk.observe(document.querySelector("#pk_text"), { characterData: true, childList: true });
                                        jgjg(2);
                                    }
                                    func0(times[0]);
                                    let waitFor0 = setInterval(() => {
                                        if (times[0] == 0) {
                                            clearInterval(waitFor0);
                                            func1(times[1]);
                                        }
                                    }, 1000);
                                    let waitFor1 = setInterval(() => {
                                        if (times[0] == 0 && times[1] == 0) {
                                            clearInterval(waitFor1);
                                            func2(times[2]);
                                        }
                                    }, 1000);
                                } else {
                                    alert('体力不足');
                                }
                            }
                            document.getElementsByClassName('btn-outline-secondary')[0].addEventListener('click', gobattle, false);
                        }

                        function selector_act() {
                            var btnNum = $(".btn-group .btn-secondary").index(this);
                            $(".btn-group .btn-secondary")
                                .eq(btnNum)
                                .css("background-color", "rgb(135, 206, 250)")
                                .siblings(".btn-group .btn-secondary")
                                .css("background-color", "rgb(255, 255, 255)");
                        }
                        let btnselector = document.getElementsByClassName('btn-secondary');
                        for (let i = 0; i < btnselector.length; i++) {
                            btnselector[i].addEventListener('click', selector_act, false);
                        }
                    }
                }, 1000);
            }
        });
        observerBody0.observe(document.getElementsByClassName('panel panel-primary')[0], { childList: true, subtree: true, });

        let keepCheck = document.createElement('form');
        keepCheck.innerHTML = `<div class="form-group form-check">
    <label class="form-check-label" for="keepcheck">暂时保持记录</label>
    <input type="checkbox" class="form-check-input" id="keepcheck">
  </div>`;
        document.getElementsByClassName('panel panel-primary')[1].insertBefore(keepCheck, document.getElementById('pk_text'));
        document.querySelector("#keepcheck").addEventListener('click', () => { localStorage.setItem('keepcheck', document.querySelector("#keepcheck").checked) }, false);
        document.querySelector("#keepcheck").checked = (localStorage.getItem('keepcheck') == 'true');

        let div0_pk_text_more = document.createElement('div');
        div0_pk_text_more.setAttribute('id', 'pk_text_more');
        div0_pk_text_more.setAttribute('class', 'panel-body');
        document.getElementsByClassName('panel panel-primary')[1].appendChild(div0_pk_text_more);
        let pkText = document.querySelector("#pk_text").innerHTML;
        let observerBody1 = new MutationObserver(() => {
            if (document.querySelector("#keepcheck").checked == true) {
                document.querySelector("#pk_text_more").innerHTML = pkText + document.querySelector("#pk_text_more").innerHTML;
                pkText = document.querySelector("#pk_text").innerHTML;
            }
        });
        observerBody1.observe(document.querySelector("#pk_text"), { characterData: true, childList: true });

        let btn1 = document.createElement('button');
        let btn2 = document.createElement('button');
        let span0 = document.createElement('span');
        span0.innerHTML = '  提交中...';
        span0.className = 'tip';
        //btn1.innerHTML = '正在读取卡片...';
        btn1.innerHTML = '提交数据';
        btn1.onmousedown = () => {
            if (btn1.innerText[0] == '提') {
                $('.tip').show();
            }
        };
        btn1.onclick = () => {
            if (btn1.innerText[0] == '提') {
                try {
                    alert('数据采集已关闭');
                    $('.tip').hide();
                    //localStorage.clear();
                    //                     let npc = document.getElementById('pklist').children;
                    //                     for(let i = 2;i<12;i++){
                    //                         //console.log(npc[o].innerText[0]);
                    //                         if(npc[i].innerText[0]!='已'){
                    //                             localStorage.setItem('over', 0); //未与全部npc战斗
                    //                             alert('未与全部npc战斗，请与全部npc完成战斗后提交')
                    //                             break;
                    //                         }
                    //                         else{
                    //                             localStorage.setItem('over', 1);
                    //                         }
                    //                     }
                    //                     if(submitData()){
                    //                         alert('数据已提交，第一次使用记得把用户名站内发给thewzmath');
                    //                         $('.tip').hide();
                    //                     }
                    //                     else{
                    //                         if(localStorage.length<=4&&localStorage.getItem('over')=='1'){
                    //                             alert('无数据');
                    //                         }
                    //                         $('.tip').hide();
                    //                     }
                } catch (err) {
                    console.log(err);
                    alert('数据提交失败，请重试');
                    $('.tip').hide();
                }
            }
        };
        btn2.innerText = '清空数据';
        btn2.onclick = () => {
            if (confirm('确定要清空数据吗？\n*确定后会刷新页面')) {
                localStorage.clear();
                window.location.reload();
            }
        }

        wishExpireTip();

        let p = document.getElementsByClassName('panel panel-primary')[0];
        p.insertBefore(span0, p.children[0]);
        p.insertBefore(btn1, p.children[0]);
        p.insertBefore(btn2, p.children[0]);
        $('.tip').hide();
    }
})();