// ==UserScript==
// @name            fancy follow
// @namespace       http://tampermonkey.net/
// @version         0.6
// @description     one key follow fancy user!
// @author          Paul
// @match           *://fancy.com
// @match           *://fancy.com/*
// @require         https://cdnjs.cloudflare.com/ajax/libs/layer/2.3/layer.js
// @grant           GM_addStyle
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/374613/fancy%20follow.user.js
// @updateURL https://update.greasyfork.org/scripts/374613/fancy%20follow.meta.js
// ==/UserScript==
(function () {
    ({
        $body: $('body'),
        $cfgWinForm: null,
        $startBtn: null,
        item_total: 0,
        querySelector:'li[tid]',
        getItemtids: function () {
            var i = 0, lis, len, item, array = [];
            lis = document.querySelectorAll(this.querySelector);
            for (i, len = lis.length; i < len; i++) {
                item = lis[i];
                array.push(item.getAttribute('tid'));
            }
            return array;
        },
        getItemFlowers: function (tid) {
            var dfd = $.Deferred();
            this._getItemFlowers(dfd, tid, 1, [], this.fllowCount);
            return dfd.promise();
        },
        _getItemFlowers: function (dfd, tid, page, notFlowers, getCount) {
            //https://fancy.com/thing_follower_list.json?thing_id=298333629&page=10000
            var uri = "https://fancy.com/thing_follower_list.json?thing_id=" + tid + "&page=" + page;
            $.getJSON(uri, this._successfn.bind(this, dfd, tid, page, notFlowers, getCount));
            //$.getJSON(uri, function (res) {
            //    this._successfn(dfd, tid, page, notFlowers, getCount, res);
            //}.bind(this));
        },
        _successfn: function (dfd, tid, page, notFlowers, getCount, res) {
            var i = 0, len, item, users, isFull = false;
            if (typeof res.users != 'undefined'
                && res.users) {
                for (i, users = res.users, len = users.length; i < len; i++) {
                    item = users[i];
                    if (!item.following) {
                        if (getCount != -1
                            && notFlowers.length >= getCount
                        ) {
                            isFull = true;
                            break;
                        }
                        notFlowers.push(item.id);
                    }
                }
            }
            if (!isFull && typeof res.has_next != 'undefined' && res.has_next) {
                setTimeout(this._getItemFlowers.bind(this, dfd, tid, page + 1, notFlowers, getCount), this.getRandomMs());
            } else {
                dfd.resolve(notFlowers);
            }
        },
        item_array: null,
        empty_item_array_fn: function (itemExecCount) {
            if (this.item_array !== null
                && this.item_array.length > 0
                && (this._itemCount != -1 && this._itemCount < this.itemCount)
            ) {
                itemExecCount++;
                this._itemCount++;
                this.$body.trigger('item_progress', [itemExecCount, this.item_total, '$itemCount']);
                this.getItemFlowers(this.item_array.shift()).done(function (notFlowers) {
                    //console.log(notFlowers);
                    this.exec_post_flower_promise(notFlowers)
                        .done(this.empty_item_array_fn.bind(this, itemExecCount));
                }.bind(this));
            } else {
                alert("执行完成！");
                this.$startBtn.show();
                layer.closeAll();
                //console.log("主 item 执行完成！")
            }
        },
        _itemCount: 0,
        itemCount: 0,
        fllowCount: 0,
        exec_post_flower_promise: function (notFlowers) {
            var dfd = $.Deferred();
            this.exec_post_flower(notFlowers, dfd, notFlowers.length, 0);
            return dfd.promise();
        },
        exec_post_flower: function (notFlowers, dfd, total, flowerExecCount) {
            var doCount = 1, do_array, when_dfds, len = notFlowers.length;
            //console.log("当前剩余关注总数：" + len);
            if (len > 0) {
                do_array = notFlowers.splice(0, doCount);
                flowerExecCount += do_array.length;
                this.$body.trigger('flower_progress', [flowerExecCount, total, '$fllowCount']);
                when_dfds = [];
                while (do_array.length > 0) {
                    when_dfds.push(this.post_flower(do_array.shift()));
                }
                if (when_dfds.length > 0) {
                    $.when.apply($, when_dfds).done(this.exec_post_flower.bind(this, notFlowers, dfd, total, flowerExecCount));
                }
            } else {
                dfd.resolve();
            }
        },
        getRandomMs: function () {
            var array = [24,
                15,
                16,
                13,
                19,
                21,
                11,
                10,
                25,
                26], rand;
            rand = parseInt(Math.random() * 11, 10); //Math.round(Math.random() * 10);
            return array[rand]*1000;
        },
        post_flower: function (userid) {
            var dfd = $.Deferred();
            setTimeout(this._delay_post_flower.bind(this, userid, dfd), this.getRandomMs());
            //setTimeout(function (userid, dfd) {
            //    $.post('https://fancy.com/add_follow.xml?_=' + (+new Date()), { user_id: userid }, function () {
            //        dfd.resolve();
            //    });
            //}.bind(this, userid, dfd), this.getRandomMs());
            return dfd.promise();
        },
        _delay_post_flower: function (userid, dfd) {
            $.post('https://fancy.com/add_follow.xml?_=' + (+new Date()), { user_id: userid }, function () {
                dfd.resolve();
            });
        },
        exce: function (itemCount, fllowCount) {
            var len;
            if (itemCount == -1) {
                this._itemCount = -1;
            } else {
                this._itemCount = 0;
            }
            this.itemCount = itemCount || 1;
            this.fllowCount = fllowCount || -1;
            this.item_array = this.getItemtids();
            len = this.item_array.length;
            this.item_total = this.itemCount > len ? len : this.itemCount;
            this.empty_item_array_fn(0);
        },
        createCss: function () {
            $(document.head).append('<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/layer/2.3/skin/layer.css"/>')
            GM_addStyle(
                '.one_key_flowing{position:fixed;right:10px;top:180px;color: #427fbb;border-color: rgba(71, 135, 197, 0.6);line-height: 24px;border-radius: 3px;background: #fff;padding: 0 8px;}\
                 .one_key_flowing:hover{color:#fff;background-color:#427fbb;}\
                 .cfg_label{display: block;font-size:12px;color: #393d4d;font-weight:bold;padding:17px 0 7px;width:340px;}\
                 .cfg_inputtext{width: 307px; background: #f8f8f8; border: 1px solid #d1d5d7; border-radius: 2px;-webkit-appearance: none; margin: 0; padding: 5px 7px; line-height: 19px;font-size: 13px;color: #393D4D;-webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.02), 0 1px 0 rgba(255, 255, 255, 0.075);    outline: none;font-style: normal;    quotes: none;list-style: none;vertical-align: baseline; }\
                 .cfg_progress{ width:300px;display:block;height: 30px;line-height: 30px;margin-bottom:10px; }\
                 .cfg_progress .cfg_progress_label{ width:70px;display:inline-block;float: left; }\
                 .cfg_progress .cfg_progress_bar{ width:200px;display:inline-block;margin-left:15px;height: 30px; }\
                 .cfg_progress .cfg_progress_bar span{ background-color:#C1E1FC;width:0;height:100%;display:block;text-align:center;}\
                '
            )
            return this;
        },
        createStartBtn: function () {
            this.$startBtn = $('<button class="one_key_flowing">一键关注</button>');
            this.$body.append(this.$startBtn);
            this.$startBtn.off('click').on('click', this.createCfgWin.bind(this));
            return this;
        },
        createProcessWin: function () {
            layer.open({
                type: 1,
                title: '执行进度情况',
                content: '<div style="margin: 20px;">\
                            <div class="cfg_progress">\
                                <div class="cfg_progress_label">Item进度:</div>\
                                <div class="cfg_progress_bar"><span id="itemCount">0%</span></div>\
                            </div>\
                            <div class="cfg_progress">\
                                <div class="cfg_progress_label">关注进度:</div>\
                                <div class="cfg_progress_bar"><span id="fllowCount">0%</span></div>\
                            </div>\
                          </div>\
                         ',
                shade: false,
                success: function (layero, index) {
                    this.$itemCount = layero.find('#itemCount');
                    this.$fllowCount = layero.find('#fllowCount');
                    this.$body.off('item_progress flower_progress').on('item_progress flower_progress', function (e, cur, total, el) {
                        var progress = cur / total * 100;
                        progress = progress + '%';
                        this[el].css('width', progress).html(progress);
                    }.bind(this));
                    this.exce(this.itemCount, this.fllowCount);
                }.bind(this)
            })
        },
        createCfgWin: function (e) {
            layer.open({
                type: 1,
                title: '执行的配置',
                content: '<form style="padding:0 10px;" onsubmit="return false;">\
                            <lable class="cfg_label">要关注的Item数：</label>\
                            <input class="cfg_inputtext" name="itemCount" value="10"/>\
                            <lable class="cfg_label">每个Item要关注的人数：</label>\
                            <input class="cfg_inputtext" name="fllowCount" value="10" />\
                          </form>',
                btn: ['确定', '取消'],
                success: function (layero, index) {
                    this.$cfgWinForm = layero.find('form:first');
                }.bind(this),
                yes: this.cfgWin_yes.bind(this)
            });
        },
        _getCfgFromValue: function () {
            var array = this.$cfgWinForm.serializeArray(), obj = {}, i, len, item;
            for (i = 0, len = array.length; i < len; i++) {
                item = array[i];
                obj[item.name] = item.value;
            }
            for (i in obj) {
                obj[i] = parseInt(obj[i], 10);
                if (isNaN(obj[i])) {
                    return "参数有误！";
                }
            }
            return obj;

        },
        cfgWin_yes: function (index, layero) {
            var val = this._getCfgFromValue();
            if (typeof val == 'string') {
                alert(val);
                return;
            }
            this.itemCount = val.itemCount;
            this.fllowCount = val.fllowCount;
            layer.close(index);
            this.$startBtn.hide();
            //创建进度框
            this.createProcessWin();
        },
        run: function () {
            if (document.querySelectorAll(this.querySelector).length > 0) {
                this.createCss().createStartBtn();
            }
            //this.createProcessWin();
        }
    }).run();
})();
