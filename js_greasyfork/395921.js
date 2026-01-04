// ==UserScript==
// @name         搜寻股票
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  搜寻小圣杯股票
// @author       You
// @include      /https?:\/\/(bgm\.tv|bangumi\.tv|chii\.in)\/(.*)?/
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/395921/%E6%90%9C%E5%AF%BB%E8%82%A1%E7%A5%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/395921/%E6%90%9C%E5%AF%BB%E8%82%A1%E7%A5%A8.meta.js
// ==/UserScript==

(function() {
    // 买入api: https://tinygrail.com/api/chara/bid/Id/Price/Amount
    // 状态api: https://tinygrail.com/api/chara/Id
    let stateapi = 'https://tinygrail.com/api/chara/';
    let askapi = 'https://tinygrail.com/api/chara/depth/';
    let dateobj = new Date();
    let date = dateobj.toLocaleDateString();
    let id = 0;
    let grail_list = JSON.parse(localStorage.getItem("grail_list"));
    let usecheck = false;
    console.log(grail_list);
    if(grail_list === null) {
        grail_list = {
            date: date,
            idlist: [],
        };
    }
    let stopflag = true;
    let box = $('<div>');
    box.css({
        'box-sizing': 'border-box',
        position: 'fixed',
        top: 0,
        left: '-300px',
        width: '300px',
        height: '800px',
        background: 'white',
        border: 'solid 1px black',
        'z-index': 10,
    });
    let contentbox = $('<div>');
    contentbox.css({
        position: 'relative',
    });
    let boxshow = $('<div show="hidden">▶</div>');
    boxshow.css({
        position: 'absolute',
        width: '30px',
        right: '-30px',
        background: 'white',
        'text-align': 'center',
        border: 'solid 1px black',
        'border-radius': '0 15px 15px 0',
    });
    boxshow.click(function() {
        if($(this).attr('show') == 'hidden') {
            $(this).attr('show', 'show').text('◀');
            box.css({
                left: 0,
            });
        } else {
            $(this).attr('show', 'hidden').text('▶');
            box.css({
                left: '-300px',
            });
        }
    });
    let startid = $('<input type="number">');
    startid.css({
        width: '80px',
        'margin-left': '3px',
    });
    let startbtn = $('<button>');
    startbtn.text('start');
    startbtn.css({
        'margin-left': '3px',
    });
    let stopbtn = $('<button>');
    stopbtn.text('stop');
    stopbtn.css({
        'margin-left': '3px',
    });
    let idp = $('<p>');
    let maxprice = $('<input type="number">');
    maxprice.css({
        width: '50px',
        'margin-left': '3px',
    });
    let usecheck_input = $('<input type="checkbox">');
    usecheck_input.css({
        'margin-left': '3px',
    });
    usecheck_input.click(function() {
        let checked = $(this).prop('checked');
        if(checked) {
            usecheck = true;
        } else {
            usecheck = false;
        }
    });
    let topbox = $('<div>');
    topbox.css({
        position: 'relative',
        top: 0,
        left: 0,
        height: '60px',
        background: '#eee',
        'line-height': '30px',
    });
    let infbox = $('<div>');
    infbox.css({
        height: '740px',
        'overflow-y': 'auto',
    });
    startbtn.click(function() {
        infbox.empty();
        id = startid.val() ? parseInt(startid.val()) : 0;
        stopflag = false;
        getAsks();
    });
    stopbtn.click(function() {
        stopflag = true;
    });
    topbox.append(startid);
    topbox.append(startbtn);
    topbox.append(stopbtn);
    topbox.append(maxprice);
    topbox.append(usecheck_input);
    usecheck_input.after('check');
    topbox.append(idp);
    contentbox.append(boxshow);
    contentbox.append(topbox);
    contentbox.append(infbox);
    box.append(contentbox);
    $('html').append(box);
    let list = [];
    function checkState(checkid) {
        let state = 0;
        let url = stateapi + checkid;
        $.ajax({
            url: url,
            contentType:'application/json; charset=utf-8',
            traditional: true,
            xhrFields: { withCredentials: true },
            timeout: 5000,
            async: false,
            success: function(data) {
                console.log(data);
                state = date.State;
                if(data.State == 0) {
                    if(grail_list.idlist.indexOf(checkid) == -1) {
                        grail_list.idlist.push(checkid);
                        localStorage.setItem("grail_list", JSON.stringify(grail_list));
                    }
                } else {
                }
            },
            error: function() {
                setTimeout(checkState, 5000);
            }
        });
        return state;
    }
    function getAsks() {
        if(id > 76000) {
            return;
        }
        if(grail_list.idlist.indexOf(id) == -1) {
            if(usecheck) {
                id += 1;
                return getAsks();
            }
            let state = checkState(id);
            if(state) {
                id += 1;
                return getAsks();
            }
        }
        let url = askapi + id;
        if(stopflag) {
            return;
        }
        $.ajax({
            url: url,
            contentType:'application/json; charset=utf-8',
            traditional: true,
            xhrFields: { withCredentials: true },
            timeout: 5000,
            success: function(data) {
                console.log(data);
                idp.text('...' + id);
                if(data.State == 0) {
                    let asks = data.Value.Asks;
                    if(asks.length > 0) {
                        let first = asks[0];
                        list.push();
                        let price = first.Price;
                        let amount = first.Amount;
                        if(amount == 0 || price == 0) {
                            id += 1;
                            return getAsks();
                        }
                        let maxprice_num = parseFloat(maxprice.val());
                        if(maxprice_num && maxprice_num < price) {
                            id += 1;
                            return getAsks();
                        }
                        let a = $('<a target="_blank">');
                        a.attr('href', 'https://bgm.tv/character/' + id);
                        let p = $('<p>');
                        if(price <= 12) {
                            p.css('color', 'orange');
                        }
                        if (price <= 10) {
                            p.css('color', 'red');
                        }
                        p.text('id: ' + id + ' price: ' + price +' amount: ' + amount);
                        a.append(p);
                        infbox.append(a);
                        box.scrollTop(box.get(0).scrollHeight);
                    }
                    id += 1;
                    getAsks();
                } else {
                    id += 1;
                    getAsks();
                }
            },
            error: function() {
                idp.text('...' + id + '...error');
                setTimeout(getAsks, 5000);
            }
        });
    }
})();