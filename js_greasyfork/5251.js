// ==UserScript==
// @name            PB_Task
// @author          monsm
// @version         1.10
// @lastmodified    2013-11-04 18:45:11
// @run-at          document-end
// @description     自动完成打酱油任务以及资讯表态
// @namespace       http://i.pcbeta.com/space-uid-1004992.html
// @include         http://bbs.pcbeta.com/*
// @copyright       2013+ Rin Satsuki
// @downloadURL https://update.greasyfork.org/scripts/5251/PB_Task.user.js
// @updateURL https://update.greasyfork.org/scripts/5251/PB_Task.meta.js
// ==/UserScript==

(function() {
    var x,
        LS,
        doTask,
        getDate,
        task_info,
        finishTime,
        getAidArray,
        portalClick;
    if (typeof Ajax != 'function') {
        return;
    }
    x = new Ajax('HTML');
    LS = function(key, val) {
        return val === undefined ? localStorage[key] : localStorage[key] = val;
    };
    getDate = function() {
        var d = new Date(),
            z = {y: d.getFullYear(), m: d.getMonth() + 1, d: d.getDate()};
        return Number(String(z.y) + (z.m < 10 ? '0' + z.m : z.m) + (z.d < 10 ? '0' + z.d : z.d));
    };
    doTask = function(id) {
        x.get('home.php?mod=task&do=apply&id=' + id, function() {
            x.get('home.php?mod=task&do=draw&id=' + id, function() {
                task_info.textContent = 'ID为' + id + '的任务完成...';
                getAidArray();
            });
        });
    };
    getAidArray = function() {
        x.get('portal.php', function(s) {
            var obj, list, url, aidArray = [], i;
            obj = document.createElement('div');
            obj.innerHTML = s;
            list = obj.querySelectorAll('#pt_list a.more');
            obj = null;
            if (!list) {
                getAidArray();
                return;
            }
            for (i = 0; i < list.length; i++) {
                url = list.item(i).href;
                aidArray.push(url.slice(url.indexOf('-') + 1, url.lastIndexOf('-')));
            }
            if (aidArray.length > 10) {
                aidArray.length = 10;
            }
            portalClick(aidArray);
        });
    };
    portalClick = function(aidArray) {
        if (!aidArray.length) {
            task_info.textContent = '文章ID获取失败，正在重试......';
            getAidArray();
            return;
        }
        var aid = aidArray.shift();
        x.get('portal.php?mod=view&aid=' + aid, function(s) {
            var obj, clickurl;
            obj = document.createElement('div');
            obj.innerHTML = s;
            try {
                clickurl = obj.querySelector('#click_aid_' + aid + '_4').href;
            } catch(e) {}
            obj = null;
            if (!clickurl) {
                task_info.textContent = '表态链接获取失败，正在重试......';
                aidArray.push(aid);
                setTimeout(function() {
                    portalClick(aidArray);
                }, 1e4);
                return;
            }
            x.get(clickurl, function() {
                task_info.textContent = '文章ID:' + aid + '表态成功...';
                if (aidArray.length > 0) {
                    portalClick(aidArray);
                } else {
                    LS('Task_' + discuz_uid, getDate());
                    task_info.textContent = '打酱油和文章表态已经完成...';
                }
            });
        });
    };
    finishTime = parseInt(LS('Task_' + discuz_uid), 10) || 0;
    if (discuz_uid != '0' && finishTime < getDate()) {
        task_info = document.createElement('div');
        task_info.textContent = '点击开始打酱油......';
        task_info.style.cssText = 'position:fixed;top:7px;left:3px;background:#009AD9;color:#FFF;cursor:pointer;z-index:2048;padding:0px 6px 0px 3px';
        task_info.onclick = function() {
            this.onclick = null;
            doTask(53);
        };
        document.body.appendChild(task_info);
    }
} ());
