// ==UserScript==
// @name         微信广告后台增强
// @namespace    http://tampermonkey.net/
// @version      0.5.3
// @description  添加批量开启/暂停/删除功能
// @author       You
// @require       https://unpkg.com/jquery@3.3.1/dist/jquery.min.js
// @require       https://unpkg.com/async@2.6.1/dist/async.min.js
// @match        https://mp.weixin.qq.com/promotion/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/373552/%E5%BE%AE%E4%BF%A1%E5%B9%BF%E5%91%8A%E5%90%8E%E5%8F%B0%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/373552/%E5%BE%AE%E4%BF%A1%E5%B9%BF%E5%91%8A%E5%90%8E%E5%8F%B0%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

    'use strict';
    var initialized = false;
    var parseQueryString = function( queryString ) {
        var params = {}, queries, temp, i, l;
        // Split into key/value pairs
        queries = queryString.split("&");
        // Convert the array of strings into an object
        for ( i = 0, l = queries.length; i < l; i++ ) {
            temp = queries[i].split('=');
            params[temp[0]] = temp[1];
        }
        return params;
    };
    // 微信的 token
    const getToken = () => {
        const href = document.location.href;
        const [ url, token ] = href.match(/token=(\d+)/)
        return token;
    }
    //添加 checkbox
    const addCheck = () => {
        $('main [role=table] tbody tr').each((i, tr) => {
            const firstCell = $(tr).find('td:first');
            const txt = firstCell.text();
            // 单元格内容举例：ale1017-2-副本计划 ID: 77405915
            const [, id] = txt.split('计划 ID: ')
            firstCell.append(`<input class="idSelector" name="selectedId" value="${i}" type="checkbox" />`);
        });
    }
    // 添加进度条
    const addProgressBar = ({ total = 0 }) => {
        const bar = `<div id="progressbar">
            <span id="finished">0</span> / <span id="total">${total}</span>
            </div>`;
       $('body').append(bar);
    };
    //进度条自增
    const incrProgressBar = (count=1) => {
        const current = parseInt($('#finished').html());
        $('#finished').html(current + count);
    };
    //移除进度条
    const removeProgressBar = () => {
        $('#progressbar').remove();
    }

    // 获取选择的计划 ID 数组。
    // 需要注意的是页面是无刷新的，翻页后 checkbox 不会被销毁，所以直接绑 value 的模式不行
    // 除非能检测到 DOM 刷新事件，然后重新生成
    const getSelectedIdAll = () => {
        const results = [];
        const name = getCurrentTab();
        switch(name) {
            case "投放计划名称":
                $('.idSelector:checked').each(function(){
                    const firstCell = $(this).parent('td');
                    const txt = firstCell.text();
                    const [, id] = txt.split('计划 ID: ');
                    results.push(parseInt(id));
                });
            break;
            case "广告名称":
                $('.idSelector:checked').each(function(){
                    const firstCell = $(this).parent('td');
                    const txt = firstCell.text();
                    const [, id] = txt.split('广告 ID: ');
                    results.push(parseInt(id));
                });
            break;
            default:
               return alert('无法获知当前 tab 页');
        }
        return results;
    };
    // 生成 pos_type 参数，目前不明白为什么朋友圈广告参数是 999
    const getCurrentPos = () => {
        const qs = parseQueryString(document.location.search);
        // 公众号广告是0，pos_type 是 0；朋友圈广告是1,pos_type 是 999
        if(parseInt(qs.type)) {
            return 999;
        } else {
            return 0;
        }
    }
    const request = ({ url, args }) => {
        const token = getToken();
        return $.post( url, {
               args: JSON.stringify(args),
               token,
               appid: '',
               spid: '',
            _: (new Date).getTime()
        });
    };
    const getCurrentTab = () => {
        return $('[role=columnheader]:first-child')[0].innerText.trim();
    };
    //删除计划接口
    const delete_campaign = ({ cid, pos_type }) => {
        const args = { cid, pos_type };
        const name = getCurrentTab();
        let url = '';
        switch(name) {
            case "投放计划名称":
                url = 'https://mp.weixin.qq.com/promotion/v3/delete_campaign';
            break;
            case "广告名称":
                args.oper_aids = [{ aid: cid, pos_type }];
                url = 'https://mp.weixin.qq.com/promotion/v3/batch_delete_adgroup';
            break;
            default:
               return alert('无法获知当前 tab 页');
        }
        return request({ url, args });
    };
    //继续投放的接口
    const resume_campaign = ({ cid, pos_type }) => {
        const args = { cid, pos_type };
        const name = getCurrentTab();
        let url = '';
        switch(name) {
            case "投放计划名称":
                url = 'https://mp.weixin.qq.com/promotion/v3/resume_campaign';
            break;
            case "广告名称":
                args.oper_aids = [{ aid: cid, pos_type }];
                url = 'https://mp.weixin.qq.com/promotion/v3/batch_resume_adgroup';
            break;
            default:
               return alert('无法获知当前 tab 页');
        }
        return request({ url, args });
    };
    // 暂停计划的接口
    const suspend_campaign = ({ cid, pos_type }) => {
        const args = { cid, pos_type };
        const name = getCurrentTab();
        let url = '';
        switch(name) {
            case "投放计划名称":
                url = 'https://mp.weixin.qq.com/promotion/v3/suspend_campaign';
            break;
            case "广告名称":
                args.oper_aids = [{ aid: cid, pos_type }];
                url = 'https://mp.weixin.qq.com/promotion/v3/batch_suspend_adgroup';
            break;
            default:
               return alert('无法获知当前 tab 页');
        }
        return request({ url, args });
    };

    //批量暂停的按钮
    const addPauseBtn = () => {
        // conitnue = ''
        //
        const pauseBtn = $('<button class="pauseBtn Button_new__base-1H7bt Button_new__default-3C02p Button_new__mini-catyW"><svg width="10" height="10" viewBox="0 0 14 14" style="margin-right: 3px;"><circle cx="7" cy="7" r="7"></circle><path d="M4 4h2v6H4V4zm4 0h2v6H8V4z" fill="#fff"></path></svg> 暂停所选</button>');
        pauseBtn.click(() => {
            const idArr = getSelectedIdAll();
            if (!confirm(`是否确认暂停？共 ${idArr.length} 个计划`)) {
                return;
            }
            const pos = getCurrentPos();
            const total = idArr.length;
            addProgressBar({ total });
            // async.mapLimit 文档： http://caolan.github.io/async/docs.html#mapLimit
            async.mapLimit(idArr, 1, (id, callback) => {
                // 速度较快时会有频率限制，主要是删除接口的频率限制
                setTimeout(()=>{
                    suspend_campaign({
                        cid: id,
                        pos_type: pos
                    }).done(res => {
                        callback(null, res);
                    }).fail(() => {
                        callback(null, { ret: -1 });
                    }).always(() => {
                        incrProgressBar();
                    });
                }, 100);
            }, function(err, results) {
                removeProgressBar();
                let success = 0;
                let failed = 0;
                for(let result of results) {
                    if(result.ret === 0) {
                        success++;
                    } else {
                        failed++;
                        console.log(result);
                    }
                }
                if(failed > 0) {
                    alert(`提醒：失败数 ${failed}，完成 ${success}`);
                }
            });
        });
        // .ui-flex 是翻页的区块
        $('.ui-flex').prepend(pauseBtn);

        // 继续投放的按钮
        const startBtn = $(`<button class="startBtn Button_new__base-1H7bt Button_new__default-3C02p Button_new__mini-catyW">
<svg width="10" height="10" style="margin-right: 3px;"><path d="M5 10A5 5 0 1 1 5 0a5 5 0 0 1 0 10zM3.5 2.5v5l4-2.5-4-2.5z" fill-rule="nonzero"></path></svg> 开启投放</button>`);
        startBtn.click(() => {
            const idArr = getSelectedIdAll();
            if (!confirm(`是否确认投放？共 ${idArr.length} 个计划`)) {
                return;
            }
            const pos = getCurrentPos();
            const total = idArr.length;
            addProgressBar({ total });
            async.mapLimit(idArr, 1, (id, callback) => {
                setTimeout(()=>{
                    resume_campaign({
                        cid: id,
                        pos_type: pos
                    }).done(res => {
                        incrProgressBar();
                        callback(null, res);
                        incrProgressBar();
                    }).fail(() => {
                        callback(null, { ret: -1 });
                    });
                }, 100);
            }, function(err, results) {
                removeProgressBar();
                let success = 0;
                let failed = 0;
                for(let result of results) {
                    if(result.ret === 0) {
                        success++;
                    } else {
                        failed++;
                        console.log(result);
                    }
                }
                if(failed > 0) {
                    alert(`提醒：失败数 ${failed}，完成 ${success}`);
                }
            });
        });
        $('.ui-flex').prepend(startBtn);

        // 删除计划的按钮
        const delBtn = $('<button class="delBtn Button_new__base-1H7bt Button_new__default-3C02p Button_new__mini-catyW"><svg width="10" height="10" viewBox="0 0 14 14" style="margin-right: 3px;"><circle cx="7" cy="7" r="7"></circle><path d="M4 4h2v6H4V4zm4 0h2v6H8V4z" fill="#fff"></path></svg> 删除所选</button>');
        delBtn.click(() => {
            const idArr = getSelectedIdAll();
            if (!confirm(`是否确认删除？共 ${idArr.length} 个计划`)) {
                return;
            }
            const pos = getCurrentPos();
            const total = idArr.length;
            addProgressBar({ total });
            async.mapLimit(idArr, 1, (id, callback) => {
                setTimeout(()=>{
                    delete_campaign({
                        cid: id,
                        pos_type: pos
                    }).done(res => {
                        callback(null, res);
                    }).fail(() => {
                        callback(null, { ret: -1 });
                    }).always(() => {
                        incrProgressBar();
                    });
                }, 1000);
            }, function(err, results) {
                removeProgressBar();
                let success = 0;
                let failed = 0;
                for(let result of results) {
                    if(result.ret === 0) {
                        success++;
                    } else {
                        failed++;
                        console.log(result);
                    }
                }
                if(failed > 0) {
                    alert(`提醒：失败数 ${failed}，完成 ${success}`);
                }
            });
        });
        $('.ui-flex').prepend(delBtn);

        // 全选/取消全选
        const selectAll = $('<label class="selAllLabel"><input type="checkbox" class="selAll" /> 全选/取消</label>');
        selectAll.change(function(i) {
            var status = $(this).find('.selAll')[0].checked;
            $('.idSelector').each(function(){
                this.checked = status;
            });
        });
        $('.ui-flex').prepend(selectAll);
    };

    //开始操作的按钮
    // 设计这个按钮的原因是： 不知道何时DOM渲染完毕，后台可能使用了 React 或者 Vue 之类的技术
    // 如果能检测到渲染完毕，可以自动加载
    const addStartBtn = () => {
       const startBtn = $('<button style="position: fixed;top:50%;left:0;z-index:2;" class="addBtn Button_new__base-1H7bt Button_new__primary-2diSJ Button_new__mini-catyW Button_new__iconBtn-NYPRT">批量操作</button>');
        startBtn.click(() => {
            if(initialized) {
                return;
            }
            initialized = true;
            addCheck();
            addPauseBtn();
            startBtn.remove();
        });
        $('body').append(startBtn);
    };

    // 添加 css 样式到当前页面 GM_addStyle 的文档 https://tampermonkey.net/documentation.php?ext=dhdg#GM_addStyle
    GM_addStyle(`
        .pauseBtn {}
        .startBtn{
            color: #67C23A !important;
        }
        .delBtn{
            color:#F56C6C !important;
        }
        .pauseBtn,
        .startBtn,
        .delBtn {
            margin-right: 15px;
        }
        .selAllLabel {
            line-height: 1;
            padding:6px 12px;
        }
        .idSelector {
            position:absolute;
            left:5px;
            top:5px;
            height: 36px;
            font-size: 43px;
        }
        .addBtn {
            position: fixed;
            top:50%;
            left:0;
            z-index:2;
    padding: 0 8px;
    background-color: #44b549;
    box-shadow: inset 0 0 0 1px #39973d;
    color: #fff;
border-radius: 3px;
        }
        #progressbar{
            z-index:2;
            position: fixed;
            top:30%;
            left:46%;
            padding:0 20px;
            border-radius: 12px;
            font-size:64px;
            background-color: hsla(0,87%,69%,.1);
            border-color: hsla(0,87%,69%,.2);
            color: #f56c6c;
        }
        .ui-flex{
            display:block !important;
            min-height:80px;
        }
        #test_pagination{
            float: right
        }
    `);

$(() => {
    addStartBtn();
});

