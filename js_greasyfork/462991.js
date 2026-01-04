// ==UserScript==
// @name         bitahub显卡仪表盘
// @namespace    https://www.bitahub.com/
// @version      1.0
// @description  本脚本提供了bitahub的显卡仪表盘，方便大家训练时查看可用显卡，以更充分地利用算力资源。
// @author       yunqiao
// @homepageURL  https://github.com/liaoyinuo/bitahub-gpu-dashboard
// @match        *://bitahub.ustc.edu.cn/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAHpUExURQAAACKX8yGW8yKW8yKW8yKV8yKX8yGW8yGW8yKV8yGW8yGW8yKW8yKW8yKV8ySY9SGW8yKW9CaZ9iGU8iWY9SGW8yOX9COW9CKW8yCV8iGU8iWY9Suc+h+V8imb+R+V8CWY9ima+CKX8yGW8yKW8yub+ieX9iKW8yKX9CKV8yKX8yKW8yCV8iKW8yKX8yWW9CCW8iGV8yWY9iKV8ySW9SGW8iia+SOX8yKX8yGW8yKW8yCV8iOW8ySW9SOX8yKY8yGW8yKX8yGW8yGW8yOX9CGW8ySY9SGW8iGW8yKW8yGW8yGW8x+V8SKW8yGW8yGW8yKV8yKW9CKW8yGW8yGW8yGW8yGW8yKW8yCW8yKX8yGX8yKW8yKX8iGX8yOY8yyd/CWX9R+V8SGW8yma+Sma+Cqa+SGV8yKV8yCV8iyd+ySY9SKW8yKX8yGW8y+f/SKY8iGW8yWX9SSY8yKW8yOY9SOX9CCW8yOW9CKW8yGV8yKV8yKW8yWY9SKW8yOZ8yKV8iOX9SKW8yWX9iGW9CKW8yGW8iKV8yKX8yWZ9C6e/SeY9SGW8yWY9iKV8yaX9SKX8yGW8yeb9yeY9SGW8yGW8yeY9iKV8ySX9SKV8yCV8iGW8yCW8yCV8iCW8iCV8yGW9CGW8h+V8h+V8UvtKqAAAACadFJOUwBe9cLJoaDyNl/8+si0mnLH5gFkU+Sjltn3qpIe7FrNaDR27wpAF9PXZZklFNFbBfZesFxAkkY7YN/d9gkBCC1loc89PX6LkTfBueXsxvNkoIm/4uHqbdzmhvnQTuQROj16sRdOF41j/jnHrayACb95eQLMa7P+r76b8M151AFa0KBIZsOTXl0fCA7XSFoLXJtGAzS1A5bClfiPXmiJAAABzklEQVRIx7WWVW/DMBSFvXZb1466tR0zMzMzMzMzMzMzY+KOfunSLEkb1clqTTsvkW/Op8TnXksGAEMe3p5eOH7gThKuWIAbQVhjAU8EIQMgIr/EyjTdP+iApAoCRzJQTmACClygSuANSQoAMvppa1djwdPq+AgUAaoRGY5KSEGgHZm6ExQEInEBIgfh7xb5JWrTYZZ83Uy8iW0aP9ZfBUkcoKywqSjEdKAlgQ6h98sQSJWa83Wwyfol4UxsG1APJGYZx7rPAH5cZeeTBZqRjeuj/YogrmCvZQEbJOBMA42ZXOGWZAFFIMI/6EAn6R/NVQYgtwfX2pQoM0MdX09qmAb4csDQhz4lRFuZkjaO9Z+tmdYHaP/j35p+M7FxMDcbgICOPF6nhX+JVnBdPX/42lpj4+WGOrqc0YhMq3UBItZ+B+EDVIlunDCQhgQWRc50cYaRfW5B9MQ1lNrwx1t6Dv92RP8ASHCBJVxgWYsJXB3OGxbWV2LQThep1IUGKO1yLSXtAOh5R03s2B0Aj8/wB9jTAxfUMh0BaGd1xhfmC6dKhiCVU9TSBwF0nuiMFgwAHNUq3Uyr1I70MjlUztfwdhfgAf92daAuJ68A9/rzDc7YKBwNxyFJAAAAAElFTkSuQmCC
// @grant        unsafeWindow
// @grant        GM_addStyle
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/462991/bitahub%E6%98%BE%E5%8D%A1%E4%BB%AA%E8%A1%A8%E7%9B%98.user.js
// @updateURL https://update.greasyfork.org/scripts/462991/bitahub%E6%98%BE%E5%8D%A1%E4%BB%AA%E8%A1%A8%E7%9B%98.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 更改图标样式 & 增添表格样式
    GM_addStyle('.flag-item .go-consulting{background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAH1UExURQAAAKittaettaestaertaettaestqestaestqertaestqestaistqaqtKettamut6mtt6ittaestaestaestqettqertaestaertaestaastKastKartKist6estqmttaestaestamstaestqestaettamttaertaertauuuaittaertaquuqertaastKestaettaestqeutqestaettqettaestaastKattqattKestaeutqestaertaistaestamttqettaestaist6estaeutqestqestqertaestaestqestquvuqestaestaest6mst6esta6vvaertaestaestaestqertaastKesta2uvaittaestaist6esta6vvaistaittqett6estaettauuu6estamsuKestaittaettaitta2uvKmst6ettaittamvtaestqestaertaestaistaettaestqestqmvtqestaett6estaistaittqist6estamtt6estauuuKertaistaistqitt6ettqattaestaeutqmttaestqutuqastaittaquuqqsuaestqestaqtuaertamtt6ertaWstKestKyuvKyuuq2uvKuuuqastKastKestaastKestKettaertaartCRiGM0AAAChdFJOUwDJXvyhoMnyNl/C+qNk9QFTv8f+5OZe9VrZ9+yqkgoB79eS0bG0EWV2RqGgNJt63GU9PbRAXfn2BZpgAc1t07lymfNIzxfDrWPqrMhA4uQJx2QIfoblvpoU5jnIlov2CZFIeYBOF92w4cFbLTpomzsfNyVc34lc0MYO1D0IZnLQ8HnMRpPXs2uvjXkLApZOoMIXAzS1A5bClc3sHloeWvjNkKezzwAAAcFJREFUSMe9llVTw0AUhRdaKLRYW2iLu7u7u7u7u7u7u7tsAvxO2pCmzbAN2Qc4L5m9Od9scu7dTADA0OP9wxOOHziT0AELcIJQggXcQCgCoC583IyfLq80gL8jxJEIVENMQIALZOACIuoaWRsoZCk4V05wAOWIDBusDAOzyNQtCIOAJy4AwxD+ISuul/ZON2FrpIAkuQDsWH8VgQWkViY3u/MH6qOoEEIIfWBKbMpWzoLWr5ygY1sndYDH0s9Yl2nAj6msElogFNk4L8ovyGYKK8wOhUigiQLyE5nCJgMIihD+bjsKcItjKifMI0GH6YQBY31Fz3Ta0g0IYoB9XrGSvVr//Bq/PnymfftdpR88G0cGDALg0pWFM0sp0mL2LMVUKSbN9aVQHdhyTKskAhHruZ1hYA7ZuGPDQA8S2OE4022lP+xHu5wnrq+/0Yils20C/u+Z1gFKXECOC+zhAodbG/qFpJoWtNNeLLanALVOdeV4ABbfUd+xsgsArm+JbyBTd6NdvYxFbdChMd7RO1TItGVZq3o5jPCXjGmMQhoA1jaWmpm2tLGmlqO+5mzlqXwAC/izXwf1z8krFvD85vjyBaGJThDjY+pDAAAAAElFTkSuQmCC) no-repeat 50% !important; background-size: 24px 24px !important;}')
    GM_addStyle('.flag-item:hover .go-consulting{background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAHpUExURQAAACKX8yGW8yKW8yKW8yKV8yKX8yGW8yGW8yKV8yGW8yGW8yKW8yKW8yKV8ySY9SGW8yKW9CaZ9iGU8iWY9SGW8yOX9COW9CKW8yCV8iGU8iWY9Suc+h+V8imb+R+V8CWY9ima+CKX8yGW8yKW8yub+ieX9iKW8yKX9CKV8yKX8yKW8yCV8iKW8yKX8yWW9CCW8iGV8yWY9iKV8ySW9SGW8iia+SOX8yKX8yGW8yKW8yCV8iOW8ySW9SOX8yKY8yGW8yKX8yGW8yGW8yOX9CGW8ySY9SGW8iGW8yKW8yGW8yGW8x+V8SKW8yGW8yGW8yKV8yKW9CKW8yGW8yGW8yGW8yGW8yKW8yCW8yKX8yGX8yKW8yKX8iGX8yOY8yyd/CWX9R+V8SGW8yma+Sma+Cqa+SGV8yKV8yCV8iyd+ySY9SKW8yKX8yGW8y+f/SKY8iGW8yWX9SSY8yKW8yOY9SOX9CCW8yOW9CKW8yGV8yKV8yKW8yWY9SKW8yOZ8yKV8iOX9SKW8yWX9iGW9CKW8yGW8iKV8yKX8yWZ9C6e/SeY9SGW8yWY9iKV8yaX9SKX8yGW8yeb9yeY9SGW8yGW8yeY9iKV8ySX9SKV8yCV8iGW8yCW8yCV8iCW8iCV8yGW9CGW8h+V8h+V8UvtKqAAAACadFJOUwBe9cLJoaDyNl/8+si0mnLH5gFkU+Sjltn3qpIe7FrNaDR27wpAF9PXZZklFNFbBfZesFxAkkY7YN/d9gkBCC1loc89PX6LkTfBueXsxvNkoIm/4uHqbdzmhvnQTuQROj16sRdOF41j/jnHrayACb95eQLMa7P+r76b8M151AFa0KBIZsOTXl0fCA7XSFoLXJtGAzS1A5bClfiPXmiJAAABzklEQVRIx7WWVW/DMBSFvXZb1466tR0zMzMzMzMzMzMzY+KOfunSLEkb1clqTTsvkW/Op8TnXksGAEMe3p5eOH7gThKuWIAbQVhjAU8EIQMgIr/EyjTdP+iApAoCRzJQTmACClygSuANSQoAMvppa1djwdPq+AgUAaoRGY5KSEGgHZm6ExQEInEBIgfh7xb5JWrTYZZ83Uy8iW0aP9ZfBUkcoKywqSjEdKAlgQ6h98sQSJWa83Wwyfol4UxsG1APJGYZx7rPAH5cZeeTBZqRjeuj/YogrmCvZQEbJOBMA42ZXOGWZAFFIMI/6EAn6R/NVQYgtwfX2pQoM0MdX09qmAb4csDQhz4lRFuZkjaO9Z+tmdYHaP/j35p+M7FxMDcbgICOPF6nhX+JVnBdPX/42lpj4+WGOrqc0YhMq3UBItZ+B+EDVIlunDCQhgQWRc50cYaRfW5B9MQ1lNrwx1t6Dv92RP8ASHCBJVxgWYsJXB3OGxbWV2LQThep1IUGKO1yLSXtAOh5R03s2B0Aj8/wB9jTAxfUMh0BaGd1xhfmC6dKhiCVU9TSBwF0nuiMFgwAHNUq3Uyr1I70MjlUztfwdhfgAf92daAuJ68A9/rzDc7YKBwNxyFJAAAAAElFTkSuQmCC) no-repeat 50% !important; background-size: 24px 24px !important;}')
    GM_addStyle('table.dataframe{font-family:verdana,arial,sans-serif;font-size:11px;color:#333;border-width:1px;border-color:#667;border-collapse:collapse}table.dataframe th{border-width:1px;padding:8px;border-style:solid;border-color:#667;background-color:#ccc;text-align:center}table.dataframe td{border-width:1px;padding:8px;border-style:solid;border-color:#667;text-align:center}table.dataframe tr td:first-child{text-align:left}table.dataframe button{border:0;outline:0;background-color:transparent;text-align:left;color:red;font-weight:bold;cursor:pointer}.oddrowcolor{background-color:#fff}.evenrowcolor{background-color:#eee}')

    // 加载后执行主函数
    window.onload = function () {
        add_lis();
        preload();
    };

    // 增加监听事件，当移到图标上才会请求显卡资源
    function add_lis() {
        var ba = document.querySelector(".flag-right");
        ba.onmouseenter = function () {
            get_gpu();
            console.log('获取好了一次显卡资源信息喵\(=^-ω-^=\)');
        };
    }

    // 调整样式，给一个假表格防止错位
    function preload() {
        var dc = document.querySelector(".consulting-con");
        dc.parentNode.style.width = '282px';
        dc.parentNode.style.height = '445px';
        dc.parentNode.style.padding = '12px 12px 3px 12px';
    }


    // 主函数，获取显卡资源信息并渲染
    function get_gpu() {
        var req = new XMLHttpRequest();
        req.open("GET", 'https://bitahub.ustc.edu.cn/resources/all', true);
        req.responseType = 'document';
        req.send();

        req.onload = function () {
            if (req.readyState === req.DONE) {
                if (req.status === 200) {
                    var tb = req.responseXML.querySelector("table");
                    var dc = document.querySelector(".consulting-con");
                    dc.innerHTML = '';
                    dc.appendChild(altRows(proc(tb)));
                    dc.appendChild(get_time());
                }
            }
        };
    }

    // 获取当前时间，返回div
    function get_time() {
        var timediv = document.createElement("div");
        timediv.innerHTML = '信息最后获取于： ' + new Date().toLocaleString('chinese', { hour12: false });
        timediv.style.textAlign = 'center';
        timediv.style.marginTop = '3px';
        return timediv
    }

    // 返回一个刷新显卡资源的按钮
    function AddButton() {
        var btn = document.createElement("button");
        btn.innerHTML = 'Refresh';
        btn.onclick = function () {
            get_gpu();
        };
        return btn;
    }

    // 精简信息、重排信息，表格左上角转为按钮
    function proc(tb) {
        var rowlen = tb.rows.length;
        for (let i = 0; i < rowlen; i++) {
            for (var j = 0; j < 4; j++) {
                tb.rows[i].deleteCell(-1);
            }
            if (tb.rows[i].cells[0].innerHTML[0] === 'c') {
                tb.deleteRow(i);
                i -= 1;
                rowlen -= 1;
            }
            if (tb.rows[i].cells[0].innerText[0] === 'd') {
                var dbgxh = i;
                console.log(dbgxh);
            }
        }

        tb.rows[0].cells[0].innerHTML = '';
        tb.rows[0].cells[0].appendChild(AddButton())


        tb = swap(tb, 1, dbgxh);
        //tb = swap(tb, 6, 8);
        //tb = swap(tb, 5, 6);
        //tb.deleteRow(2);
        //tb.deleteRow(6);
        return tb
    }

    // 交换表格的两行
    function swap(tb, a, b) {
        var tmp = tb.rows[a].innerHTML;
        tb.rows[a].innerHTML = tb.rows[b].innerHTML;
        tb.rows[b].innerHTML = tmp;
        return tb
    }

    // 表格奇偶行不同背景颜色
    function altRows(tb) {
        var rows = tb.getElementsByTagName("tr");
        for (var i = 1; i < rows.length; i++) {
            if (i % 2 == 0) {
                rows[i].className = "evenrowcolor";
            } else {
                rows[i].className = "oddrowcolor";
            }
        }
        return tb
    }

})();