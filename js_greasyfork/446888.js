// ==UserScript==
// @name         s_s 交易助手
// @namespace    https://
// @version      2.0.2
// @description  -- 略
// @author       tuite
// @match        https://**.7seasnft.com/**
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/446888/s_s%20%E4%BA%A4%E6%98%93%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/446888/s_s%20%E4%BA%A4%E6%98%93%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(function () {
    'use strict';
    var vvv = '2.0.2'
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
    var get_no_null = (getf, f, time) => {
        setTimeout(() => {
            var goods = getf();
            if (goods == null) {
                console.log(false)
                get_no_null(getf, f, time);
            } else {
                f(goods)
            }
        }, time)
    }
    var get_no_null_list = (getf, f, time) => {
        setTimeout(() => {
            var goods = getf();
            if (goods.length <= 0) {
                console.log(false)
                get_no_null_list(getf, f, time);
            } else {
                f(goods)
            }
        }, time)
    }
    var check_ts_s = false;
    //判断插件是否可用
    var check_ts_ok = () => {
        var geta = () => {
            return document.querySelector('.explore-section div.container div.row a.details')
        }
        var checkaa = (ae) => {
            var a = ae.href
            var zz = /https:\/\/www.7seasnft.com\/product-details-v1-\d*$/
            var ok = a.match(zz);
            check_ts_s = ok != null && ok.length > 0
            if (!check_ts_s) {
                document.querySelector('h1.hero-title').textContent = '超级探索无法使用'
            }
        }
        get_no_null(geta, checkaa, 800)
    }
    // 详情页
    if (window.location.pathname.includes('product-details-v1')) {
        var sfjk = false
        // nft id
        var id = parseInt(window.location.pathname.replaceAll('/product-details-v1-', ''))
        // 请求
        var req = async (url, data) => {
            return await fetch(url, {
                method: 'POST',
                body: data,
                headers: {
                    'Host': 'www.7seasnft.com',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.124 Safari/537.36 Edg/102.0.1245.44',
                    'Accept': 'application/json, text/plain, */*',
                    'Accept-Language': 'zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'veri-ex-client': 'web',
                    'language': 'en_US',
                    'DNT': 1,
                    'token': undefined,
                    'Origin': 'https://www.7seasnft.com',
                    'Connection': 'keep-alive',
                    'Sec-Fetch-Dest': 'empty',
                    'Sec-Fetch-Mode': 'cors',
                    'Sec-Fetch-Site': 'same-origin',
                    'TE': 'trailers'
                }
            }).then(res => {
                return res.json()
            }).then(res => {
                return res
            }).catch(e => {
                // alert('异常，请联系ZH\n' + e)
                console.log('error', e)
                return null;
            })
        }
        // 请求详情
        var nft_detail = async () => {
            return await req('https://www.7seasnft.com/web_api/artwork/detail', 'id=' + id).then(d => {
                if (d == null || !d.result || 'Successful' != d.message) {
                    console.log('error', d)
                    return
                }
                return d
            });
        }
        var new_bid_req = (id) => { // TODO https://www.7seasnft.com/web_api/auction/artwork/bid/list auctionRecordId=60092&page=1&pageSize=10&statusListStr=1%402
            req('https://www.7seasnft.com/web_api/auction/artwork/bid/list', 'auctionRecordId=' + id + '&page=1&pageSize=10&statusListStr=1%402').then(d => {
                if (d == null || !d.result || 'Successful' != d.message) {
                    console.log('error', d)
                    return
                }
                if (d.data.length > 0) {
                    var bid = d.data[0];
                    var p = bid.price
                    var f = bid.bidderNickName
                    var t = new Date(bid.createTime).toLocaleString()
                    var h = '<div class="pro-column-head" style="width: 40%;">' + p + ' LCUSD</div>\n' +
                        '<div class="pro-column-head" style="width: 30%;">' + f + '</div>\n' +
                        '<div class="pro-column-head" style="width: 30%;">' + t + '</div>'
                    var bd = document.createElement('div');
                    bd.classList = 'pro-row-data'
                    bd.innerHTML = h
                    document.querySelector('.pro-row-head')
                        .insertAdjacentElement('afterend', bd)
                }
                new_bid(id)
            });
        }
        // 计算价格
        var jsjg = () => {
            var ippp = () => {
                return document.querySelector('.el-dialog input');
            }
            var next = (ippp) => {
                var jg_str = ippp.placeholder.split(' ');
                var p = parseInt(jg_str[3])
                p = (parseFloat(p).toFixed(0))
                ippp.value = p;
                ippp.focus();
                var event = document.createEvent('Event');
                event.initEvent('input', true, true);
                ippp.dispatchEvent(event);
                if (parseInt(p) > 11000) {
                    console.log(p)
                    ippp.previousElementSibling.insertAdjacentHTML('beforeend', '　<font color="red" size="5">超过11000请手动出价！</font>')
                    return
                }
                document.querySelector('.el-dialog a.btn').click()
                document.querySelector('.item-detail-content h1')
                    .insertAdjacentHTML('afterend'
                        , '<p>已提交</p>')
                // wait_loading(() => {
                //     document.querySelector('.el-dialog a.btn').click()
                // }, 150)
            }
            get_no_null(ippp, next, 200)
            return
        }
        var new_bid = (id) => {
            setTimeout(() => {
                new_bid_req(id)
            }, 1500)
        }
        var bid = (qpj, a_id, zgj) => {
            document.querySelector('a.btn[data-bs-target]').click()
            jsjg();
            // nft_detail().then(n => {
            //     var tt = document.createElement('p')
            //     tt.className = 'fw-medium'
            //     tt.textContent = new Date(n.data.auctionEndTime).toLocaleString()
            //     var bar = document.querySelector('a.btn[data-bs-target]').parentElement.parentElement;
            //     bar.appendChild(tt)
            //     new_bid(n.data.curPendingId)
            // })
        }
        var start_jk = (e) => {
            if (sfjk) {
                alert('正在监控！')
                return
            } else {
                sfjk = true
            }
            // var getP = () => {
            //     return document.querySelector('.el-collapse-item__content div.pro-row-data')
            // }
            // get_no_null(getP, bid, 200);
            bid();
            // wait_loading(bid, 300)
        }

        var wait_loading = (f, time) => {
            setTimeout(function () {
                if (document.querySelector('.circular') == null)
                    f()
                else {
                    console.log(false)
                    wait_loading(f, time)
                }
            }, time)
        }
        var add_jk_btn = (tb_btn) => {
            // var bar = tb_btn.parentElement.parentElement;
            // var jk_btn_h = '<a id="jk_btn" href="#" class="btn btn-dark d-block">监控投标</a>'
            // var jk_btn_li_h = document.createElement('li')
            // jk_btn_li_h.className = 'flex-grow-1'
            // jk_btn_li_h.innerHTML = jk_btn_h
            // bar.appendChild(jk_btn_li_h)
            // document.querySelector('#jk_btn').onclick = start_jk
            // document.querySelector('#jk_btn').click()
            start_jk();
        }
        // 检查是否家初始化完成
        var chujia_btn = () => {
            let tb_btn = document.querySelector('a.btn[data-bs-target]');
            if (tb_btn == null) {
                console.log('没拿到')
                setTimeout(chujia_btn, 300)
            } else {
                console.log("拿到")
                add_jk_btn(tb_btn)
            }
        }
        chujia_btn();
    }
    // 探索页
    if ('/explore-v2' == window.location.pathname) {
        check_ts_ok()
        setTimeout(() => {
            var bar = document.querySelectorAll('section div.filter-box div.filter-box-filter-item')[0];
            var oldhtml = bar.innerHTML;
            var newhtml = oldhtml +
                '<input type="text" placeholder="最高最后出价" class="form-control form-control-s1" id="lastinput">' +
                '<a class="btn btn-sm btn-dark" href="#" id="qhtsbtnpro">探索加强</a><p>版本 ' + vvv + '</p>'
            bar.innerHTML = newhtml
            // 探索完成展示
            var pronext = (dd, t) => {
                var tt = new Date().getTime() - t;
                alert('探索完成！\n' +
                    '用时：' + parseInt(tt / 1000) + ' 秒\n' +
                    '达成：' + dd.length + ' 件')
                var p = document.createElement('p');
                p.textContent = '探索完成。'
                document.body.querySelector('section div.row').appendChild(p)
            }
            var add_a = (id, p, x) => {
                var aa = document.createElement('a')
                aa.href = 'https://www.7seasnft.com/product-details-v1-' + id
                aa.textContent = '现价：' + p + ' 页：' + x
                aa.target = '_blank'
                aa.style.cssText = 'color: #8c8989;'
                document.body.querySelector('section div.row').appendChild(aa)
            }
            // 最大页数
            var zdys = null;
            var zdye_get = () => {
                var zys_li = document.querySelector('.el-pager li:last-child')
                if (zys_li == null) {
                    setTimeout(zdye_get, 150);
                } else {
                    zdys = parseInt(document.querySelector('.el-pager li:last-child').textContent)
                }
            }
            zdye_get()
            // 探索
            var dd = [];
            var cp = 0;
            var ts_pro = async (x, x2, t, type) => {
                var lp = document.getElementById('lastinput').value;
                if (lp == '') {
                    alert('请输入最高最后出价！')
                    return
                }
                document.getElementById('qhtsbtnpro').disabled = true
                if (x == undefined || !(typeof x == 'number')) {
                    // x = parseInt(zdys / 2)
                    x2 = 40;
                    t = new Date().getTime()
                    if (type) {
                        document.body.querySelector('section div.row').innerHTML = '正在探索。。。'
                        x = 51
                    } else {
                        x = 50
                    }
                }
                console.log("页数", x)
                console.log("扫描量", x2)
                console.log("达成量", dd.length)
                fetch('https://www.7seasnft.com/web_api/artwork/list', {
                    method: 'POST',
                    body: 'page=' + x + '&pageSize=40&title=&isOrderByQuotedPrice=1&isOrderByCurPendingEndTime=1&statusList%5B0%5D=5',
                    headers: {
                        'Host': 'www.7seasnft.com',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.124 Safari/537.36 Edg/102.0.1245.44',
                        'Accept': 'application/json, text/plain, */*',
                        'Accept-Language': 'zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2',
                        'Accept-Encoding': 'gzip, deflate, br',
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'veri-ex-client': 'web',
                        'language': 'en_US',
                        // 'token': tk,
                        'DNT': 1,
                        'Origin': 'https://www.7seasnft.com',
                        'Connection': 'keep-alive',
                        'Sec-Fetch-Dest': 'empty',
                        'Sec-Fetch-Mode': 'cors',
                        'Sec-Fetch-Site': 'same-origin',
                        'TE': 'trailers'
                    }
                }).then(data => {
                    return data.json()
                }).then(da => {
                    var total = da.total;
                    if (da.result && da.message == 'Successful' && total > 0) {
                        var time = new Date().getTime();
                        da.data.forEach((d, i) => {
                            var max = d.maxQuotedPrice;
                            if (max == undefined || max == null) {
                                max = d.lastTradePrice
                            }
                            max = parseFloat(max)
                            if (max < parseFloat(lp) && d.auctionEndTime > time) {
                                add_a(d.id, max, x)
                                if (dd.length == 0) {
                                    add_msc(bar)
                                }
                                dd.push({
                                    jg: max,
                                    id: d.id,
                                    nm: d.title,
                                    pg: x,
                                    i: i + 1
                                });
                            }
                        })
                    } else {
                        alert('异常\n请联系ZH\n' + da.result + '\n' + da.message)
                    }
                    if (x <= 1 || x == zdys || da.data.length == 0) {
                        if (cp == 1) {
                            pronext(dd, t)
                        } else {
                            cp += 1
                        }
                        return
                    } else {
                        setTimeout(() => {
                            ts_pro(type ? x += 1 : x -= 1, x2 += 40, t, type);
                        }, parseInt(1000 * Math.random()))
                    }
                }).catch(error => {
                    console.log('error', error)
                    // alert('异常\n请联系ZH\n' + error)
                    setTimeout(() => {
                        ts_pro(x, x2, t, type);
                    }, 2000 + parseInt(1234 * Math.random()))
                })
            }
            document.getElementById('qhtsbtnpro').onclick = function () {
                if (null == zdys || !check_ts_s) {
                    alert('请稍后重试')
                    return
                }
                this.disabled = true
                this.textContent = '🚫 再次探索请先刷新页面！'
                ts_pro(undefined, null, null, true)
                ts_pro(undefined, null, null, false)
                this.onclick = () => console.log('再次探索请刷新页面！')
            };
        }, 1800)
    }
    // 活动页
    if ('/activity-v2' == window.location.pathname) {
        do_activity()
    }

    function do_activity() {
        var getAP = () => {
            return document.querySelectorAll('p.card-s1-text span')
        }
        var sumAP = (aps) => {
            var sum = 0;
            aps.forEach((ap, api) => {
                sum += parseFloat(ap.innerText.split(' ')[0])
            })
            document.querySelector('.user-panel-title-box h3').insertAdjacentHTML('beforeend', '　<font color="red" size="5"> 近十次流水：' + sum.toFixed(4) + '</font>')
        }
        get_no_null_list(getAP, sumAP, 800)
    }
})();

