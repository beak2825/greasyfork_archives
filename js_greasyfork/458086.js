// ==UserScript==
// @name         职业标准系统|国家职业技能标准查询系统 PDF浏览器查看下载
// @namespace    L-biaozhun
// @version      0.3.9.5
// @description  职业标准系统的PDF增加 使用浏览器阅读器查看、使用浏览器下载pdf 功能
// @author       L
// @match        *://www.osta.org.cn/skillStandard*
// @match        *://osta.mohrss.gov.cn/skillStandard*
// @grant        none
// @run-at       document-body
// @homepage     https://www.ihawo.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/458086/%E8%81%8C%E4%B8%9A%E6%A0%87%E5%87%86%E7%B3%BB%E7%BB%9F%7C%E5%9B%BD%E5%AE%B6%E8%81%8C%E4%B8%9A%E6%8A%80%E8%83%BD%E6%A0%87%E5%87%86%E6%9F%A5%E8%AF%A2%E7%B3%BB%E7%BB%9F%20PDF%E6%B5%8F%E8%A7%88%E5%99%A8%E6%9F%A5%E7%9C%8B%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/458086/%E8%81%8C%E4%B8%9A%E6%A0%87%E5%87%86%E7%B3%BB%E7%BB%9F%7C%E5%9B%BD%E5%AE%B6%E8%81%8C%E4%B8%9A%E6%8A%80%E8%83%BD%E6%A0%87%E5%87%86%E6%9F%A5%E8%AF%A2%E7%B3%BB%E7%BB%9F%20PDF%E6%B5%8F%E8%A7%88%E5%99%A8%E6%9F%A5%E7%9C%8B%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

var load, execute, loadAndExecute;
load = function(a, b, c) {
    var d;
    d = document.createElement("script"), d.setAttribute("src", a), b != null && d.addEventListener("load", b), c != null && d.addEventListener("error", c), document.body.appendChild(d);
    return d;
}, execute = function(a) {
    var b, c;
    typeof a == "function" ? b = "(" + a + ")();" : b = a, c = document.createElement("script"), c.textContent = b, document.body.appendChild(c);
    return c;
}, loadAndExecute = function(a, b) {
    return load(a, function() {
        return execute(b);
    });
};

loadAndExecute("//cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js", function() {
    $('html').append('<script src="//cdnjs.cloudflare.com/ajax/libs/layer/3.5.1/layer.min.js"></script>');

    var pdfCacheMap = {}

    $(document).on('click', '.plugin-tool', async function() {
        let type = $(this).data('type');
        let get = '/api/sys/downloadFile/decrypt';
        let item = $(this).data('item');
        if (!item) {
            return alert('获取数据失败');
        }

        let code = item['code'];
        let fileName = item['standardInfo'];
        let name = item['standardInfoName'];

        if (pdfCacheMap[code]) {
            pdfCacheMap[code]['times']++;
            processPdfData(type, name, code, pdfCacheMap[code]['data']);
            return pdfCacheMap[code]['times'] > 10 && delete pdfCacheMap[code];
        }

        if (layer) {
            layer.load(0, {
                shade: [0.5, '#000'],
            })
        }

        var pdf = await fetch(get + '?fileName=' + fileName);
        pdf = await pdf.blob();
        if (layer) {
            layer.closeAll();
        }

        pdfCacheMap[code] = {
            'data': pdf,
            'times': 1
        }

        return processPdfData(type, name, code, pdf);
    })


    function processPdfData(type, name, code, pdfData) {
        var blob = new Blob([pdfData], { type: 'application/pdf' });
        console.log(blob)
        var url = window.URL.createObjectURL(blob);

        if (type == 'open') {
            return window.open(url);
        }

        let a = document.createElement("a");
        let event = new MouseEvent("click");
        a.download = name;
        a.href = url;
        a.dispatchEvent(event);
    }
});

var requestContentMap = {};

function ajaxEventTrigger(event) {
    var ajaxEvent = new CustomEvent(event, { detail: this });
    window.dispatchEvent(ajaxEvent);
}

var oldXHR = window.XMLHttpRequest;

function newTestXHR() {
    var realXHR = new oldXHR();
    realXHR.addEventListener('readystatechange', function() { ajaxEventTrigger.call(this, 'ajaxReadyStateChange'); }, false);

    return realXHR;
}

window.XMLHttpRequest = newTestXHR;

window.addEventListener('ajaxReadyStateChange', function (e) {
    var url = e.detail.responseURL;
    if (url && url.indexOf('skillStandardList') != -1 && e.detail.readyState == 4) {
        var responseText = e.detail.responseText || '';
        var data = JSON.parse(responseText) || [];
        setTimeout(function() {rebuildTable(data)}, 500);
    }
});

function rebuildTable(data) {
    var list = (data && data.body && data.body.list) || [];
    var listMap = {};

    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        listMap[item['code']] = item;
    }

    $('.plugin-tool').remove();
    $(".arco-table-element tbody > tr").each(function() {
        var code = $(this).find('td').eq(2).text();
        var item = listMap[code];

        if (!item) {
            return true;
        }

        var toolTd =  $(this).find('td').eq(5);
        toolTd.find('a').text('网站查看');
        toolTd.find('.arco-table-td-content').append('<a class="arco-link arco-link-status-normal plugin-tool" data-type="open">浏览器查看</a>')
        toolTd.find('.arco-table-td-content').append('<a class="arco-link arco-link-status-normal plugin-tool" data-type="download">下载</a>')
        toolTd.find(".plugin-tool").data('item', item)
    })
}