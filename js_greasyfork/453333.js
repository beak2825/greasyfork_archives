// ==UserScript==
// @name         mtnb 交易助手
// @namespace    https://
// @version      1.8
// @description  -- 略
// @author       tuite
// @match        https://**.sunswap.com/**
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/453333/mtnb%20%E4%BA%A4%E6%98%93%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/453333/mtnb%20%E4%BA%A4%E6%98%93%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(function () {
    'use strict';
    var vvv = '1.8'
    var jy = false;
    var op = null;
    var getUrl = 'http://localhost:8080/get2';
    var pridiv = '<div id="pri_div" style="position: absolute; top: 150px; right: 90px; background-color: blanchedalmond; ' + 'border-radius: 7px; line-height: 25px;">\n'
        + '    <input id="ppp" placeholder="价格" value="0.00"><br>\n' + '    <button type="button" id="mrbtn">买入</button>&nbsp;<button type="button" id="mcbtn">卖出</button><a ' +
        'href="https://nomics.com/assets/mtnb-mtnb-coin" target="_blank">MTNB</a></a><br>' + '<input disabled value="Lzh12345">\n' + '</div>'
    document.body.insertAdjacentHTML('afterend', pridiv)
    // 音乐
    var msc = '<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=401250173&auto=1&height=66"></iframe>';
    // 添加音乐
    var add_msc = e => {
        var m_div = document.createElement('div')
        m_div.className = 'qihaimsc'
        m_div.innerHTML = msc
        e.appendChild(m_div)
    }
    // 移除音乐
    var del_msc = () => {
        document.querySelectorAll('.qihaimsc').forEach((e, i) => {
            e.remove();
        })
    }
    // 开始交易
    var jyStart = (opp, id) => {
        document.getElementById(id).disabled = true;
        jy = true;
        op = opp;
        jkff(1000)
    }

    var req = async (url, data) => {
        return await fetch(url)
            .then(res => res.json())
            .then(res => {
                return res
            }).catch(e => {
                changeUrl();
                console.log('error', e)
            })
    }

    var changeUrl = () => {
        if (getUrl.endsWith('2'))
            getUrl = getUrl.substring(0, getUrl.length - 1)
        else
            getUrl = getUrl + '2'
    }

    var ppp = () => {
        return parseFloat(document.getElementById('ppp').value)
    }

    var check = (p) => {
        if (op === -1) {
            if (p <= ppp()) return -1
        }
        if (op === 1) {
            if (p >= ppp()) return 1
        }
        return 0
    }

    var setCoin = (key, index) => {
        var us = Array.from(document.getElementsByClassName('item-content')).filter(i => {
            if (i.innerText.startsWith(key)) {
                return true
            }
        })
        us[index].parentElement.parentElement.parentElement.click()
    }

    var closeSelect = () => {
        Array.from(document.getElementsByClassName('ant-modal-close')).forEach(i => i.click())
    }

    var openSelect = () => {
        Array.from(document.getElementsByClassName('dragDown')).forEach(i => i.click())
    }

    var max = () => Array.from(document.getElementsByClassName('link')).filter(i => i.innerText == '最大')[0].click()

    var initSelect = (call) => {
        openSelect()
        setTimeout(() => {
            closeSelect()
            setTimeout(call, 1000)
        }, 1100)
    }

    var qr = () => {
        setTimeout(() => {
            document.getElementsByClassName('single')[0].click()
            setTimeout(() => {
                document.getElementsByClassName('single')[1].click()
            }, 800)
        }, 900)
        add_msc(document.getElementById('pri_div'))
    }

    var jkff = (time) => {
        setTimeout(async function () {
            var res = await req(getUrl)
            console.log(res)
            if (res.status === 500)
                changeUrl();
            var p = res.price
            switch (check(p)) {
                case 0:
                    jkff(res.time)
                    return
                case -1:
                    console.log("in")
                    initSelect(() => {
                        // setCoin('TRX', 0)
                        setCoin('USDT', 0)
                        setCoin('MTNB', 1)
                        max();
                        qr();
                    })
                    return
                case 1:
                    console.log("out")
                    initSelect(() => {
                        setCoin('USDT', 1)
                        setCoin('MTNB', 0)
                        max();
                        qr();
                    })
                    return
            }
        }, time)
    }

    document.getElementById("mrbtn").onclick = () => {
        jyStart(-1, "mrbtn")
    }
    document.getElementById("mcbtn").onclick = () => {
        jyStart(1, "mcbtn")
    }

})();
