// ==UserScript==
// @name         moegirlTable
// @namespace    http://tampermonkey.net/
// @version      1.03
// @description  萌娘百科新番列表產生Table
// @author       backrock12
// @match        https://zh.moegirl.org.cn/*
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387720/moegirlTable.user.js
// @updateURL https://update.greasyfork.org/scripts/387720/moegirlTable.meta.js
// ==/UserScript==


(function () {
    'use strict';
    var $ = $ || window.$;
    var table;

    async function getBase64(imgUrl) {
        return new Promise((resolve, reject) => {
            window.URL = window.URL || window.webkitURL;
            var xhr = new XMLHttpRequest();
            xhr.open("get", imgUrl, true);
            xhr.responseType = "blob";
            xhr.onload = function () {
                if (this.status == 200) {
                    //得到一个blob对象
                    var blob = this.response;
                    // 至关重要
                    let oFileReader = new FileReader();
                    oFileReader.onloadend = function (e) {
                        // 此处拿到的已经是base64的图片了,可以赋值做相应的处理
                        resolve(e.target.result)
                    }
                    oFileReader.readAsDataURL(blob);
                }
                console.log('imgUrl', this.status)
            }
            xhr.send();
        });
    }


    async function createtable() {
        var listc = [];
        var num = 1;
        var tcaption = $('h1').eq(0).text();

        var lista = $('h2');
        lista.each(function () {
            var t = $(this);
            var name = t.text();

            if (name != '目录' && name != '导航' && name != '参见' && name != '导航菜单' &&
                name != '注释' && name != '公告' && name != '讨论中事项' && name != '投票中事项'
                && name != "关于萌娘百科站内广告的说明" && name != "已结束投票"
            ) {
                var href = t.nextAll('.thumb').find('img').eq(0).attr('src');
                var time = t.nextAll('dl').find('dd').eq(1).text();
                var type = t.nextAll('ul').find('li').eq(0);
                var describe = t.nextAll('.poem').eq(0);
                var staff = t.nextAll('.columns-list').eq(0);
                var cast = t.nextAll('.columns-list').eq(1);
                var expect = '';
                var feedback = '';

                describe = describe.length > 0 ? describe.html().replace(/[\n\r]/g, '') : '';
                staff = staff.length > 0 ? staff.html().replace(/[\n\r]/g, '') : '';
                cast = cast.length > 0 ? cast.html().replace(/[\n\r]/g, '') : '';
                time = time.replace('起', '起<br />').replace(/[\n\r]/g, '');
                type = type.length > 0 ? type.text().replace(/[\n\r]/g, '') : '';
                type = type == '点此进入官方网站' ? '' : type.replace(/[\n\r]/g, '');


                var c = { no: num++, name: name, href: href, describe: describe, time: time, staff: staff, cast: cast, type: type, expect: expect, feedback: feedback }
                listc.push(c);
            }
        });

        let mdtable = '';
        table = $('<table border="1px solid #ccc" cellspacing="0" cellpadding="0" ></table>');
        var th = '<caption>' + tcaption + '</caption>';
        th += '<tr>';
        th += '<th>序号</th>';
        th += '<th>名称</th>';
        th += '<th>封面</th>';
        th += '<th>播出时间</th>';
        th += '<th>简介</th>';
        th += '<th>STAFF</th>';
        th += '<th>CAST</th>';
        th += '<th>类型</th>';
        th += '<th>期望</th>';
        th += '<th>观后感</th>';

        th += '</tr>';
        table.append(th);

        mdtable = '### ' + tcaption;
        mdtable += "\r\n";
        mdtable += '|序号|';
        mdtable += '名称|';
        mdtable += '封面|';
        mdtable += '播出时间|';
        mdtable += '简介|';
        mdtable += 'STAFF|';
        mdtable += 'CAST|';
        mdtable += '类型|';
        mdtable += '期望|';
        mdtable += '观后感|';
        mdtable += "\r\n";
        mdtable += '|---|---|---|---|---|---|---|---|---|---|';
        mdtable += "\r\n";

        for (let index = 0; index < listc.length; index++) {
            const t = listc[index];
            const Base64 = await getBase64(t.href);

            var tr = '<tr>';
            tr += '<td>' + t.no + '</td>';
            tr += '<td>' + t.name + '</td>';
            tr += '<td><img src="' + t.href + '" width="300" height="424"></td>';
            tr += '<td>' + t.time + '</td>';
            tr += '<td>' + t.describe + '</td>';
            tr += '<td>' + t.staff + '</td>';
            tr += '<td>' + t.cast + '</td>';
            tr += '<td>' + t.type + '</td>';
            tr += '<td>' + t.expect + '</td>';
            tr += '<td>' + t.feedback + '</td>';

            tr += '</tr>';
            table.append(tr);

            mdtable += '|' + t.no + '|';
            mdtable += '' + t.name + '|';
            // mdtable += '![' + name + '](' + Base64 + ')|';
            mdtable += '<img src="' + Base64 + '" width="300" height="424">|';

            mdtable += '' + t.time + '|';
            mdtable += '' + t.describe + '|';
            mdtable += '' + t.staff + '|';
            mdtable += '' + t.cast + '|';
            mdtable += '' + t.type + '|';
            mdtable += '' + t.expect + '|';
            mdtable += '' + t.feedback + '|';
            mdtable += "\r\n";

        }


        var blob = new Blob(['', "\r\n", mdtable], { type: "text/plain;charset=utf-8" });
        saveAs(blob, tcaption + '.md');

        //$('body').append(table);
        console.log(listc);
        console.log(table);

        var newwindow = window.open('', "_blank", '');
        var html = '<html><body><table>' + table.html() + '</table></body></html>';
        newwindow.document.write(html);
    }

    function inits() {
        var content = document.createElement("div");
        document.body.appendChild(content);
        content.outerHTML = `
<div id="CWDownContent">
<div style="width:40px;height:25px;position:fixed;left:3PX;top:3PX;z-index:100000;/*! background-color:#ffffff; *//*! border:1px solid #afb3b6; *//*! opacity:0.95; */filter:alpha(opacity=95);">
  <div id="CWDownSave" style="/*! width:43px; *//*! height:26px; */cursor: pointer;background-color:#3169da;/*! margin: 2px 5px 3px 10px; */">
    <span style="/*! line-height:25px; */display:block;color:#FFF;text-align:center;font-size: 10px;">产生TABLE</span>
  </div>
</div>
</div>
`;

        var WCSave = document.querySelector("#CWDownSave");

        WCSave.onclick = async function () {
            await createtable();

        }
    }


    inits();

})();

