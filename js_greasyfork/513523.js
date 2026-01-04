// ==UserScript==
// @name         录取
// @namespace    http://tampermonkey.net/
// @version      2024-12-3
// @description  try to take over the world!
// @author       You
// @license MIT
// @match        https://dekt.chzu.edu.cn:11142/dekt/*
// @exclude      https://dekt.chzu.edu.cn:11142/dekt/*hdlc/*
// @exclude      https://dekt.chzu.edu.cn:11142/dekt/wx/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chzu.edu.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513523/%E5%BD%95%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/513523/%E5%BD%95%E5%8F%96.meta.js
// ==/UserScript==


(function () {

    let hd_teplate = `{{#  layui.each(d, function(index, item){ }}
<div class="layui-col-lg6">
    <div class="hd-card" data-id="{{item.id}}">
        <div class="hd-card-l">
            <img src="{{ xht.fileDownloadAPI(item.fm) }}">
        </div>
        <div class="hd-card-r">
            <div class="hd-mc layui-elip">{{item.id}}-{{item.lqrs}}-{{ item.mc }}</div>
            <div class="hd-bq">

                <div class="hd-bq-2">{{ item.hdfl.mc }}</div>
                <div class="hd-bq-2">{{ item.currentState.name }}</div>
            </div>
            <div class="hd-ms">
                {{ item.hdjj }}
            </div>
            <div class="hd-line">
                <div>{{ moment(item.hdkssj).format('YYYY年MM月DD日 HH:mm') }}</div>
            </div>
            <div class="hd-line">
                <div>{{ item.hddd }}</div>
            </div>
            <div class="hd-act">
                <button type="button" class="layui-btn layui-btn-xs" onclick="lq('{{item.id}}')">报名情况</button>
                <button type="button" class="layui-btn layui-btn-xs" onclick="showDetail('{{item.id}}')">查看</button>
                {{# if(inDayRange(item.bmkssj, item.bmjssj)){ }}
                <button type="button" class="layui-btn layui-btn-xs" onclick="bm('{{item.id}}')">报名</button>
                {{# }else{ }}
                <button type="button" class="layui-btn layui-btn-xs" onclick="bm('{{item.id}}')">
                    {{ (notStart(item.bmkssj) ? '报名未开始' : '报名已结束')}}
                </button>
                {{# } }}
            </div>
        </div>
    </div>
</div>
{{#  }); }}
{{#  if(d.length === 0){ }}
<div class="hd-empty"></div>
{{#  } }}`
    // window.qdy = function (id) {
    //     layer.open({
    //         title: '活动录取',
    //         area: ['90%', '90%'],
    //         offset: '10px',
    //         type: 2,
    //         content: 'hdlc/hdsq/qdy?.me=MzQ1ZmJlNTctZTU3MC00YzZlLTg3MWMtYmY2MDk3MGVhMDE4&hdid=' + id,
    //         end: function () {
    //
    //         }
    //     })
    //
    // }

    window.lq = function (id) {
        var table = layui.table;
        var sfly = false;
        var isDropDownMenu = false

        let defaultWhere = {sfly: sfly}

        layer.open({
            title: '活动录取',
            area: ['90%', '90%'],
            offset: '10px',
            type: 2,
            content: 'hdlc/hdsq/tdbmqk?.me=MzQ1ZmJlNTctZTU3MC00YzZlLTg3MWMtYmY2MDk3MGVhMDE4&hdid=' + id,
            end: function () {

            }
        })
    }
    window.queryHd = function (next, page) {
        page = page || 1
        var keyword = $('#keyword').val()
        var fl = $('.kc-fl-item-act').data('fl')
        $.ajax({
            url: buildUrl("index/queryHd"),
            data: {
                keyword: keyword,
                fl: fl,
                day: _hd_day,
                lx: _hd_lx,
                page: page,
                limit: 10,
            },
            type: "get",
            dataType: "json",
            success: function (res) {
                // render
                console.log(res)
                // res.data.forEach(obj => {
                //     obj.mc = obj.id + '-' + obj.lqrs + '-' + obj.mc;
                // });

                layui.laytpl(hd_teplate).render(res.data, function (html) {
                    if (next) {
                        next(html, page < res.totalPages)
                    }
                    else {
                        $('#' + _hd_view_id + '').append(html);
                    }
                });
            },
        });
    }


})();
