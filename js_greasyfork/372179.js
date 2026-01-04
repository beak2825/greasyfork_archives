// ==UserScript==
// @name         陆金所-我的理财
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://my.lu.com/my/investment-all-v2*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/372179/%E9%99%86%E9%87%91%E6%89%80-%E6%88%91%E7%9A%84%E7%90%86%E8%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/372179/%E9%99%86%E9%87%91%E6%89%80-%E6%88%91%E7%9A%84%E7%90%86%E8%B4%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    const FINANCE = 1, PEER2PEER = 2;
    var assetType = FINANCE;

    function checkAssetType() {
        var result = true;
        var s = document.location.href.match(/assettype=\w+/i);
        if (s && (s.length >= 1)) {
            s = s[0].split('=');
            s = s[1].toLowerCase();
            if (s === 'peer2peer') assetType = PEER2PEER; else
                if (s === 'finance' || s === 'finance_v2') assetType = FINANCE; else result = false;
        }
        return result;
    }
    if (! checkAssetType()) {
        //alert(assetType);
        return;
    }
    else {
        //alert(assetType);
    }



    var infoBuf = {}, infoBufDirty = false;
    var options = { moreInfo: false };

    function getInfoFromHtml(data) {
        var a = data.split(/<span>\s*<span class="m">/);
        var r = [];
        if (a.length < 4) return r;

        function push(e) { r.push(e[0]); }

        push(a[1].match(/[\d,\.]+/));
        var b = a[2].split(/<strong class="dmoney">/);
        push(b[1].match(/[\d,\.]+/));
        push(b[2].match(/[\d,\.]+/));
        b = a[3].split(/<strong class="dmoney">/);
        push(b[1].match(/[\d,\.]+/));
        push(b[2].match(/[\d,\.]+/));

        a = data.split(/<span class="sval">\s*<strong class="m">/);
        if (a.length > 0) push(a[a.length - 1].match(/[\d\/]+/)); else r.push('0/0');
        if (a.length >= 5) push(a[a.length - 2].match(/[\d\.]+/)); else r.push('0.00');

        a = data.split('<span class="overdueDescInfo">');
        if (a.length === 2) {
            a = a[1].match(/逾期\d+天/);
            if (a) r.push(a[0].match(/\d+/)[0]);
        }
        return r;
    }

    function dateToStr() {
        var dt = new Date();
        return dt.toLocaleDateString();
    }

    function putInfoBuf(id, info) {
        infoBuf[id] = {info: info, date: dateToStr()};
        infoBufDirty = true;
    }

    function getInfoBuf(id) {
        var r = infoBuf[id];
        if (r && r.info && r.date) {
            if (dateToStr() !== r.date) r = undefined; else r = r.info;
        } else r = undefined;
        return r;
    }

    function formatMoney(n) {
        return n.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    }

    function parseMoney(d) {
        return parseFloat(d.replace(/,/g, ''));
    }

    function doTable() {
        var table = $('table.my-financing-in-possession-list'),
            thead = table.children('thead');

        function setTableHeadHeight(height) {
            thead.css('line-height', height);
        }

        var headth = thead.children('tr').children('th');
        if (options.moreInfo) {
            setTableHeadHeight('18px');
            $(headth[1]).append('<label style="color:blue;">[费率]</label>');
            $(headth[2]).append('<label>[投入]</label>');
            $(headth[3]).append('<label>[本/息]</label>');
            $(headth[4]).append('<label>[本/息]</label>');
        } else {
            for (var i = 1; i <= 4; i++) $(headth[i]).children('label').remove();
            setTableHeadHeight('');
        }

        var trList = table.children('tbody').children('tr');

        var sums = [0, 0, 0, 0, 0]; //投入,已收本金,已收利息,待收本金,待收利息

        function doTableRow(rowIndex) {
            if (rowIndex >= trList.length) {
                if (infoBufDirty) {
                    GM_setValue('lup2p-investment-all-v2-infoBuf', infoBuf);
                    infoBufDirty = false;
                }
                if (options.moreInfo) {
                    $(headth[2]).append('<label>[%1]</label>'.replace('%1', formatMoney(sums[0])));
                    $(headth[3]).append('<label>[%1/%2]</label>'.replace('%1', formatMoney(sums[1])).replace('%2', formatMoney(sums[2])));
                    $(headth[4]).append('<label>[%1/%2]</label>'.replace('%1', formatMoney(sums[3])).replace('%2', formatMoney(sums[4])));
                }
                return;
            }

            function nextRow() {
                doTableRow(rowIndex + 1);
            }

            var tr = $(trList[rowIndex]);
            if (tr.attr('data-productsourcetype') !== '9') {
                nextRow();
                return;
            }

            var td = tr.children('td');

            function removeInfo() {
                var e, p;
                for (var i = 1; i <= 5; i++) {
                    p = $(td[i]);
                    p.children('label').remove();
                    e = p.children();
                    for (var d = e.length - 1; d >= 0; d--) {
                        if ((e[d].nodeName === 'BR') && (p.html().trim().match(/<br>$/i))) $(e[d]).remove(); else break;
                    }
                }
            }

            if (!options.moreInfo) {
                removeInfo();
                nextRow();
                return;
            }

            function appendInfo(info) {
                var br = (assetType !== PEER2PEER) || (td[1].innerText.length >= 48);
                var s = (parseFloat(info[6]) > 0) ? 'blue' : 'limegreen', s2 = br ? 'padding-left:4.5em;' : '';
                s = '<label style="color:%1;%2">[%3]</label>'.replace('%1', s).replace('%2', s2).replace('%3', info[6]);
                if (br) s = '<br>' + s;
                $(td[1]).append(s);

                $(td[2]).append('<br><label>[%1]</label>'.replace('%1', info[0]));
                $(td[3]).append('<br><label>[%1/%2]</label>'.replace('%1', info[1]).replace('%2', info[2]));
                $(td[4]).append('<br><label>[%1/%2]</label>'.replace('%1', info[3]).replace('%2', info[4]));

                s = ((assetType === PEER2PEER) || ($(td[5]).text().trim().length <= 10)) ? '<br>' : '';
                if (info.length >= 8) s += '<label class="overdue-prompt">%1天</label>'.replace('%1', info[7]);
                $(td[5]).append(s + '<label>[%1]</label>'.replace('%1', info[5]));

                sums[0] += parseMoney(info[0]);
                sums[1] += parseMoney(info[1]);
                sums[2] += parseMoney(info[2]);
                sums[3] += parseMoney(info[3]);
                sums[4] += parseMoney(info[4]);
            }

            var url = tr.children('td.financing-investment-name').children('a').attr('href');
            var id = url.match(/id=\d+/i);
            if (!id) {
                nextRow();
                return;
            } else
                id = id[0].match(/\d+/)[0];
            var info = getInfoBuf(id);
            if (info) {
                appendInfo(info.split('\t'));
                nextRow();
            } else {
                $.ajax({
                    type: "get",
                    url: url,
                    success: function (data) {
                        var info = getInfoFromHtml(data);
                        putInfoBuf(id, info.join('\t'));
                        if (!options.moreInfo) return;
                        appendInfo(info);
                        nextRow();
                    },
                    timeout: 1000 * 10,
                    error: function (a, err) { if (options.moreInfo) doTableRow(rowIndex); },
                    fail: function (a, err) { if (options.moreInfo) doTableRow(rowIndex); }
                });
            }
        }
        doTableRow(0);
    }


    (function init() {
        infoBuf = GM_getValue('lup2p-investment-all-v2-infoBuf', {});
        options = GM_getValue('lup2p-investment-all-v2-options', options);

        (function createMoreInfoDiv() {
            var div = $('div.financing-type-selected');

            div.append('<div class="change-type-wrapper" style="display:inline;padding-left:3em;"><label><input type="checkbox" id="moreInfo"></input>更多内容</label></div>');
            var ck = div.children('div.change-type-wrapper').children('label').children('input#moreInfo');
            ck[0].checked = options.moreInfo;
            ck.on('click', function () {
                if (this.checked !== options.moreInfo) {
                    options.moreInfo = !options.moreInfo;
                    GM_setValue('lup2p-investment-all-v2-options', options);
                    doTable();
                }
            });

            div.append('<div class="pagination-wrap" id="moreInfoCtrl1" style="display:inline;padding-left:2em;"><div class="pagination-area" style="margin-top:1.3em;">%1</div></div>'.replace('%1', $('div.pagination-area').html()));
        })();

        (function createPageSelect() {
            var pageArea = $('div#moreInfoCtrl1').children('div.pagination-area');
            var pageUrl = '';

            function getPageCount() {
                function getIt(url) {
                    var s = url.match(/pagenum=\d+/i);
                    if (s) {
                        var s2 = s[0].match(/\d+/)[0];
                        pageUrl = url.slice(0, s.index + 8) + '%1' + url.slice(s.index + 8 + s2.length);
                        return s2;
                    }
                    return null;
                }

                var a = pageArea.children('a');
                var r = getIt(a[a.length - 1].href);
                if (r) return parseInt(r);
                r = getIt(a[1].href);
                if (r) return parseInt(r) + 1;
                return 0;
            }

            var count = getPageCount();
            if (count <= 0) return;

            var pageNum = 1, s = document.location.href.match(/pagenum=\d+/i);
            if (s) pageNum = parseInt(s[0].match(/\d+/)[0]);
            if (pageNum <= 0) pageNum = 1; else
                if (pageNum > count ) pageNum = count;

            s = '';
            for (var i = 1; i <= count; i++) {
                s += '<option value="%1"%2>%1</option>'.replace(/%1/g, i).replace('%2', (pageNum === i) ? ' selected="selected"' : '');
            }
            pageArea.append('<select id="moreInfoCtrl2">%1</select>'.replace('%1', s));
            pageArea.children('select#moreInfoCtrl2').on('change', function () {
                document.location = pageUrl.replace('%1', this.value);
            });
        })();

        if (options.moreInfo) doTable();
    })();
})();
