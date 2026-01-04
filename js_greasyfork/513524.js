// ==UserScript==
// @name         报名
// @namespace    http://tampermonkey.net/
// @version      2024-10-22
// @description  自己用
// @license MIT
// @author       dccc3
// @match        https://dekt.chzu.edu.cn:11142/dekt/hdlc/hdsq/tdbmqk*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chzu.edu.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513524/%E6%8A%A5%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/513524/%E6%8A%A5%E5%90%8D.meta.js
// ==/UserScript==

(function () {
    window.qd = function (id) {
        const url = 'kc/tdbm/' + id + '/update'
        const data = {"data.hdjl.id": hdid, "data.sfqd": true}
        $.ajax({
            url: url,
            data: data,
            type: "post",
            dataType: "json",
            success: function (res) {
                console.log(res)
            },
        })
    }
    window.qt = function (id) {
        const url = 'kc/tdbm/' + id + '/update'
        const data = {"data.hdjl.id": hdid, "data.sfqt": true}
        $.ajax({
            url: url,
            data: data,
            type: "post",
            dataType: "json",
            success: function (res) {
                console.log(res)
            },
        })
    }
    window.cancel = function (id) {
        const url = 'kc/tdbm/' + id + '/update'
        const data = {"data.hdjl.id": hdid, "data.sfqd": null}
        $.ajax({
            url: url,
            data: data,
            type: "post",
            dataType: "json",
            success: function (res) {
                console.log(res)
            },
        })
    }

    window.qd_qt = function (id) {
        const url = 'kc/tdbm/' + id + '/update'
        const data = {"data.hdjl.id": hdid, "data.sfqd": true, "data.sfqt": true}
        $.ajax({
            url: url,
            data: data,
            type: "post",
            dataType: "json",
            success: function (res) {
                console.log(res)
            },
        })
    }

    const script = document.createElement('script')
    script.setAttribute('id', 'jgpdActionColumn')
    script.setAttribute('type', 'text/html')
// 设置 script 的内容
    script.innerText = `<div class="layui-btn-group"><a class="layui-btn layui-btn-xs" onclick="qd_qt('{{d.id}}')">双签</a><a class="layui-btn layui-btn-xs" onclick="qd('{{d.id}}')">到</a><a class="layui-btn layui-btn-xs" onclick="qt('{{d.id}}')">退</a><a class="layui-btn layui-btn-danger layui-btn-xs" onclick="cancel('{{d.id}}')">取消</a></div>`
    document.body.appendChild(script)

    window.mainTable = table.render({
        elem: '#mainTable',
        height: 'full-200',
        url: 'hdlc/hdsq/tdbmqk/ajaxList?hdid=' + hdid,
        page: true,
        toolbar: '#mainActionArea',
        defaultToolbar: ['filter'],
        cols: [
            [{
                type: 'checkbox',
                fixed: 'left'
            }, {
                title: 'id',
                field: 'id',
                fixed: 'left'
            },
                {
                    title: '学工号',
                    field: 'xh',
                    sort: true,
                    templet: function (d) {
                        return objectUtils.getValue(d, 'xsjbxx.xh');
                    }
                },

                {
                    title: '姓名',
                    field: 'xm',
                    sort: true,
                    templet: function (d) {
                        return objectUtils.getValue(d, 'xsjbxx.xm');
                    }
                }, {
                title: '签到',
                field: 'sfqd',
                minWidth: 50,
                templet: function (d) {
                    let sfqd = objectUtils.getValue(d, 'sfqd');
                    return sfqd ? '是' : '否';
                }
            },
                {
                    title: '签退',
                    field: 'sfqt',
                    minWidth: 50,
                    templet: function (d) {
                        let sfqt = objectUtils.getValue(d, 'sfqt');
                        return sfqt ? '是' : '否';
                    }
                }, {
                title: '年级',
                field: 'nj',
                sort: true,
                templet: function (d) {
                    return objectUtils.getValue(d, 'xsjbxx.nj');
                }
            }, {
                title: '学院',
                field: 'xy',
                sort: true,
                templet: function (d) {
                    return objectUtils.getValue(d, 'xsjbxx.xy.mc');
                }
            }, {
                title: '专业',
                field: 'zy',
                sort: true,
                templet: function (d) {
                    return objectUtils.getValue(d, 'xsjbxx.zy.mc');
                }
            }, {
                title: '审核状态',
                field: 'tdshzt',
                sort: true,
                templet: function (d) {
                    return objectUtils.getValue(d, 'tdshzt.label');
                }
            },
                {
                    minWidth: 60,
                    title: '操作',
                    toolbar: '#jgpdActionColumn'
                }]
        ],
        done: function (p, e) {
            currentDataSize = p.count;
        }
    })
})();
