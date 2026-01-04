// ==UserScript==
// @name         关键词浏览量搜索
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  关键词浏览量搜索工具
// @author       You
// @require	     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require	     https://cdn.jsdelivr.net/npm/vue
// @match        *://jingyan.baidu.com/user/npublic?*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/391909/%E5%85%B3%E9%94%AE%E8%AF%8D%E6%B5%8F%E8%A7%88%E9%87%8F%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/391909/%E5%85%B3%E9%94%AE%E8%AF%8D%E6%B5%8F%E8%A7%88%E9%87%8F%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

// 地址 https://greasyfork.org/zh-CN/scripts/387914-%E7%9F%A5%E9%81%93%E5%90%88%E4%BC%99%E4%BA%BA%E7%BC%96%E8%BE%91%E7%95%8C%E9%9D%A2%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7

$(function () {
    $(`<button style="position: fixed;letf:0;top:0;">经验关键词浏览量</button>`)
        .on("click",search)
        .appendTo("body");

    function search() {
        $("link").remove();
        $(`<link rel="stylesheet" type="text/css" href="https://hehuoren.picp.vip/stylesheets/bootstrap.css">`).appendTo('head');
        $(`<meta name="viewport" content="width=device-width,initial-scale=1">`).appendTo('head');
        document.title="关键词浏览量搜索";

        $("body").html(`<div id="app">
    <div class="container bs-docs-container">
            <div style="
                    position: fixed;
                    background-color: wheat;
                    width: 255px;
                    top:0;
                    left:calc(50% + 380px);
                    padding: 10px 10px;
                    height:${window.innerHeight > 870 ? 870 : window.innerHeight}px;
                    overflow-x: hidden;
                    overflow-y: auto;
            ">
                <div class="form-group">
                    <div style="border:1px solid #999;margin-bottom: 10px;padding: 10px 10px 0 10px;">
                        <div class="input-group" style="margin-bottom: 10px;">
                            <div class="input-group-addon" style="width: 90px;">本地数据量</div>
                            <input readonly disabled type="text" class="form-control" style="width: 90px;" :value="rewordList.length">
                        </div>
                        <div class="input-group" style="margin-bottom: 10px;">
                            <div class="input-group-addon" style="width: 90px;">状态</div>
                            <input readonly disabled type="text" class="form-control" style="width: 110px;" :value="stateStr">
                        </div>
                        <div class="input-group" style="margin-bottom: 10px;">
                            <div class="btn-group" role="group" aria-label="Default button group">
                                <button type="button" class="btn btn-default" @click="state = 3">
                                    重置状态
                                </button>
                            </div>
                        </div>
                    </div>
                    <div style="border:1px solid #999;margin-bottom: 10px;padding: 10px 10px 0 10px;">
                        <div class="input-group" style="margin-bottom: 10px;">
                            <div class="input-group-addon" style="width: 50px;">起始页</div>
                            <input type="number" class="form-control" style="width: 100px;"  v-model="startPage">
                        </div>
                        <div class="input-group" style="margin-bottom: 10px;">
                            <div class="input-group-addon" style="width: 50px;">结束页</div>
                            <input type="number" class="form-control" style="width: 100px;"  v-model="endPage">
                        </div>
                        <div class="input-group" style="margin-bottom: 10px;">
                            <div class="input-group-addon" style="width: 90px;">时间范围</div>
                            <select class="form-control" style="width: 110px;" v-model="time">
                                <option value="1">1天内</option>
                                <option value="2">2天内</option>
                                <option value="3">3天内</option>
                                <option value="7">7天内</option>
                                <option value="30">30天内</option>
                                <option value="180">180天内</option>
                            </select>
                        </div>
                        <div class="input-group" style="margin-bottom: 10px;">
                            <div class="btn-group" role="group" aria-label="Default button group">
                                <button type="button" class="btn btn-default" @click="search">
                                    拉取
                                </button>
                            </div>
                        </div>
                    </div>
                    <div style="border:1px solid #999;margin-bottom: 10px;padding: 10px 10px 0 10px;">
                        <div class="input-group" style="margin-bottom: 10px;">
                            <div class="input-group-addon" style="width: 50px;">添加搜索词</div>
                            <input type="text" class="form-control" style="width: 100px;"  v-model="toAddWord">
                        </div>
                        <div class="input-group" style="margin-bottom: 10px;">
                            <div class="btn-group" role="group" aria-label="Default button group">
                                <button type="button" class="btn btn-default" @click="addWord">
                                    添加
                                </button>
                                <button type="button" class="btn btn-default" @click="selectAll">
                                    全选
                                </button>
                                <button type="button" class="btn btn-default" @click="unselectAll">
                                    全不选
                                </button>
                            </div>
                        </div>
                        <div class="input-group" style="" v-for="(word, word_index) in allWords">
                            <div class="checkbox" style="display: inline-block;margin-right:10px;">
                                <label>
                                    <input type="checkbox" v-model="searchWords" :value="word">{{word}}
                                </label>
                            </div>
                            <button style="margin-right: 10px;" type="button" class="btn btn-warning btn-xs" @click="removeWord(word_index)">删除</button>
                            <a class="btn btn-warning btn-xs" target="_blank" :href="defaultViewWord(word)">查看</a>
                        </div>
                    </div>
                    <div style="border:1px solid #999;margin-bottom: 10px;padding: 10px 10px 0 10px;">
                        <div class="input-group" style="margin-bottom: 10px;">
                            <div class="input-group-addon" style="width: 90px;">排序</div>
                            <select class="form-control" style="width: 110px;" v-model="sort">
                                <option value="perDayViews">日浏览量</option>
                            </select>
                        </div>
     
                        <div class="input-group" style="margin-bottom: 10px;">
                            <div class="input-group-addon" style="width: 90px;white-space: inherit;">搜索词,逗号间隔设置多个</div>
                            <textarea class="form-control" style="height: 60px;" v-model="filterWordStr"></textarea>
                        </div>
                        <div class="input-group" style="margin-bottom: 10px;">
                            <div class="input-group-addon" style="width: 90px;white-space: inherit;">排除词,逗号间隔设置多个</div>
                            <textarea class="form-control" style="height: 60px;" v-model="excludeWordStr"></textarea>
                        </div>         
                        <div class="input-group" style="margin-bottom: 10px;">
                            <div class="input-group-addon" style="width: 90px;white-space: inherit;">排除的作者名单</div>
                            <textarea class="form-control" style="height: 60px;" v-model="excludeUsers"></textarea>
                        </div>
                    </div>
                    
                    <div style="border:1px solid #999;padding: 10px 10px 0 10px;">
                        <div class="input-group" style="margin-bottom: 10px;">
                            <div class="input-group-addon" style="width: 90px;">清空范围</div>
                            <select class="form-control" style="width: 110px;" v-model="clearRange">
                                <option value="all">全部</option>
                                <option value="50%">清空一半低浏览量</option>
                                <option value="50">清空日浏览量50以下的</option>
                                <option value="100">保留最高浏览量的100</option>
                            </select>
                        </div>
                        <div class="input-group" style="margin-bottom: 10px;">
                            <button type="button" class="btn btn-default" @click="clear">
                                清空本地
                            </button>
                            <p v-if="rewordList.length>=1000">数据太多卡顿，点击清空本地</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-10">
                    <table class="table table-bordered table-hover" style="word-break: break-all;">
                        <thead>
                            <tr> 
                                <th>标题</th>
                                <th style="width: 90px;">发布时间</th>
                                <th style="width: 60px;">浏览量</th>
                                <th style="width: 80px;">日浏览量</th>
                                <th style="width: 80px;">持续时间</th>
                                <th style="width: 125px;">作者</th>

                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(reword, index) in showRewordList"
                                :style="{'background-color':index%10=== 9?'wheat':''}"
                            >
                            
                                <td><a target="_blank" :href="reword.url">{{reword.title}}</a></td>
                                <td>{{reword.createTime}}</td>
                                <td>{{reword.views}}</td>
                                <td>{{reword.perDayViews}}</td>
                                <td>{{reword.duration}}</td>
                                <td>{{reword.name}}</td>
                                <td>
                                    <a @click="remove(reword)" href="javascript:void(0)">删除</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>`);
        let key = 'my_jingyan_word_data';
        let initData = localStorage[key];
        if (initData && initData.trim()) {
            try {
                initData = JSON.parse(initData.trim())
            } catch (e) {
                initData = "";
            }
        }

        Vue.config.errorHandler = (error, vm) => {
            if (error.responseText === "<script>location.href='/verify.html';</script>") {
                alert('访问次数超限，被官方限流，请打开新页面填写验证码');
                window.open('https://jingyan.baidu.com');
            } else {
                console.error(error);
                let r = confirm('未知错误，是否清空历史数据？\n' + error.toString());
                if (r) {
                    localStorage.removeItem(key);
                }
            }
        };

        a = new Vue({
            el: "#app",
            data: initData ? initData : {
                allWords: [
                    "淘宝",
                    "王者荣耀",
                ],//special
                searchWords: [],//special
                toAddWord: '',//special
                state: 3,//2、拉取中 3、暂停
                startPage: 1,
                endPage: 5,
                time: '',
                filterWordStr: '',
                excludeWordStr: '',
                excludeUsers: '',
                rewordList: [],
                clearRange: 'all',
                sort: 'perDayViews',//searchTime
                targetNum: 0,
                getedNum: 0,
            },
            mounted: function () {

            },
            computed: {
                stateStr: function () {
                    if (this.state === 2) {
                        return `拉取中${this.getedNum}/${this.targetNum}`;
                    }
                    if (this.state === 3) {
                        return '完毕';
                    }
                },
                // 仅读取
                rewordListStr: function () {
                    return JSON.stringify(this.rewordList);
                },
                showRewordList: function () {
                    return this.rewordList
                        .map((e, index) => {
                            return {
                                index: index,
                                ...e
                            }
                        })
                        .filter(e => {
                            let filterWords = this.filterWordStr
                                .trim()
                                .split(/[,，]/)
                                .map(e => e.trim())
                                .filter(e => e);
                            if (filterWords.length === 0) {
                                return true;
                            }
                            for (let filterWord of filterWords) {
                                if (e.title.includes(filterWord)) {
                                    return true;
                                }
                            }
                            return false;
                        })
                        .filter(e => {
                            let excludeWords = this.excludeWordStr
                                .trim()
                                .split(/[,，]/)
                                .map(e => e.trim())
                                .filter(e => e);
                            for (let excludeWord of excludeWords) {
                                if (e.title.includes(excludeWord)) {
                                    return false;
                                }
                            }
                            return true;
                        })
                        .filter(e => {
                            let excludeNames = this.excludeUsers
                                .trim()
                                .split(/[,，]/)
                                .map(e => e.trim())
                                .filter(e => e);
                            for (let excludeName of excludeNames) {
                                if (e.name === excludeName) {
                                    return false;
                                }
                            }
                            return true;
                        })
                        .sort((e1, e2) => {
                            let t1 = e1[this.sort] || 0;
                            let t2 = e2[this.sort] || 0;

                            return t2 - t1;
                        });
                },
            },
            watch: {
                allWords: function (newVal, oldVal) {
                    this.save(newVal, oldVal);
                },
                searchWords: function (newVal, oldVal) {
                    this.save(newVal, oldVal);
                },
                toAddWord: function (newVal, oldVal) {
                    this.save(newVal, oldVal);
                },
                state: function (newVal, oldVal) {
                    this.save(newVal, oldVal);
                },
                startPage: function (newVal, oldVal) {
                    this.save(newVal, oldVal);
                },
                endPage: function (newVal, oldVal) {
                    this.save(newVal, oldVal);
                },
                time: function (newVal, oldVal) {
                    this.save(newVal, oldVal);
                },
                filterWordStr: function (newVal, oldVal) {
                    this.save(newVal, oldVal);
                },
                excludeWordStr: function (newVal, oldVal) {
                    this.save(newVal, oldVal);
                },
                excludeUsers: function (newVal, oldVal) {
                    this.save(newVal, oldVal);
                },
                rewordList: function (newVal, oldVal) {
                    this.save(newVal, oldVal);
                },
                clearRange: function (newVal, oldVal) {
                    this.save(newVal, oldVal);
                },
                sort: function (newVal, oldVal) {
                    this.save(newVal, oldVal);
                },
                highqualityPages: function (newVal, oldVal) {
                    this.save(newVal, oldVal);
                },
                targetNum: function (newVal, oldVal) {
                    this.save(newVal, oldVal);
                },
                getedNum: function (newVal, oldVal) {
                    this.save(newVal, oldVal);
                },
            },
            methods: {
                save: function (newVal, oldVal) {
                    localStorage[key] = JSON.stringify(this._data);
                },
                formatDateTimeByNumber: function (date) {
                    if (!date) {
                        return '';
                    }
                    date = new Date(date * 1000);
                    return (date.getMonth() + 1) + "-" +
                        date.getDate() + " " +
                        date.getHours().toString().padStart(2, '0') + ":" +
                        date.getMinutes().toString().padStart(2, '0') + ":" +
                        date.getSeconds().toString().padStart(2, '0');
                },
                search: async function () {
                    // startPage: 1,
                    // endPage: 5,
                    let startPage = +this.startPage;
                    let endPage = +this.endPage;
                    if (startPage === "") {
                        alert('请输入起始页');
                        return;
                    }
                    if (endPage === "") {
                        alert('请输入结束页');
                        return;
                    }
                    if (endPage < startPage) {
                        alert('起始页要小于结束页');
                        return;
                    }
                    if (startPage <= 0) {
                        alert('起始页不能小于1');
                        return;
                    }
                    if ((endPage - startPage) * this.searchWords.length * 7 >= 400) {
                        alert('一次不能查询超过400页');
                        return;
                    }
                    if (this.state === 2) {
                        alert('正在拉取中');
                        return;
                    }
                    if (this.searchWords.length === 0) {
                        alert('请选择搜索词');
                        return;
                    }

                    this.state = 2;
                    let targetPages = endPage - startPage + 1;
                    this.targetNum = targetPages * 10 * this.searchWords.length;
                    this.getedNum = 0;
                    let _this = this;

                    let req_urls = this.searchWords.map(function (word, i) {
                        return new Array(targetPages).fill().map(function (e2, i2) {
                            let url = _this.paramsToSearchUrl(word, (i2 + startPage) * 10, new Date().valueOf() - 1000 * 60 * 60 * 24 * _this.time);
                            return url;
                        })
                    }).flat();

                    let requests = req_urls.map(function (url, i) {
                        var dfd = $.Deferred();
                        GM_xmlhttpRequest({
                            url: url,
                            method: 'GET',
                            headers: {
                                'User-agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36',
                                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                            },
                            onerror: function () {
                                dfd.resolve('0')
                            },
                            onload: function (r) {
                                dfd.resolve(r);
                            }
                        });
                        return dfd;
                    });

                    $.when.apply(null, requests).done(function () {
                        var arr = Array.prototype.map.call(arguments, function (e, i) {
                            return e.responseText;
                        });
                        var articles = arr.map(function (e, i) {
                            return _this.listPageArticles(e);
                        });

                        articles = articles.map(function (e, i) {
                            return e.articleUrls
                        }).reduce(function (a, b) {
                            return a.concat(b)
                        }, []);
                        Promise.all(articles.map(function (e, i) {
                            return new Promise(function (resolve, reject) {
                                GM_xmlhttpRequest({
                                    url: e,
                                    method: 'GET',
                                    headers: {
                                        'User-agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36',
                                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                                    },
                                    onerror: function () {
                                        resolve(['0']);
                                    },
                                    onload: function (data) {
                                        resolve(['1', {
                                            url: e,
                                            body: data.responseText
                                        }]);
                                        _this.getedNum++;
                                    }
                                });
                            });
                        })).then(function () {
                            var result = arguments[0].filter(function (e, i) {
                                return e[0] == '1'
                            }).map(function (e, i) {
                                return e[1];
                            }).map(function (article_data, i) {
                                try {
                                    let body = article_data.body;

                                    let url = `https://jingyan.baidu.com/article/${body.match(/"eid": '(\w+)'/)[1]}.html` ||
                                        article_data.url;
                                    var title = $(body).find("h1[title]").attr('title');
                                    var views = +$(body).find(".views").text();
                                    var createTime_date = new Date($(body).find("time").text());
                                    var createTime = createTime_date.valueOf();
                                    var now = Date.now();
                                    var duration = (Date.now() - createTime) / 1000 / 60 / 60 / 24;
                                    var name = body.match(/authorUname.[^,]*,/)[0].match(/'[^']*'/)[0].replace(/'/g, '');

                                    return {
                                        url: url,
                                        title: title,
                                        perDayViews: +((views / duration).toFixed(2)),
                                        views: views,
                                        duration: +(duration.toFixed(2)),
                                        createTime: createTime_date.toISOString().replace(/T.*/, ' '),
                                        name: name,
                                        isNew: createTime > 1501516800000
                                    }
                                } catch (e) {
                                    console.error(article_data.body, e);
                                    return {}
                                }
                            }).filter(function (e) {
                                return e.isNew
                            }).sort(function (a, b) {
                                return b.perDayViews - a.perDayViews
                            });

                            _this.state = 3;
                            let map = new Map();
                            for (let reword of [..._this.rewordList, ...result]) {
                                map.set(reword.title + "_" + reword.name, {
                                    url: reword.url,
                                    title: reword.title,
                                    perDayViews: reword.perDayViews,
                                    views: reword.views,
                                    duration: reword.duration,
                                    createTime: reword.createTime,
                                    name: reword.name,
                                    isNew: reword.isNew,
                                });
                            }
                            _this.rewordList = [...map.values()];

                            console.table(result.map(function (e) {
                                return {
                                    标题: e.title,
                                    作者: e.name,
                                    日均浏览量: +(e.perDayViews.toFixed(2)),
                                    总浏览量: e.views,
                                    持续天数: +(e.duration.toFixed(2)),
                                    创建日期: e.createTime
                                }
                            }));
                            console.log("平均持续时间", result.reduce(function (a, b) {
                                return a + b.duration
                            }, 0) / result.length);
                            console.log("平均日点击量", result.reduce(function (a, b) {
                                return a + b.perDayViews
                            }, 0) / result.length);
                            console.log("总击量", result.reduce(function (a, b) {
                                return a + b.views
                            }, 0));
                            var author = {};
                            result.forEach(function (e, i) {
                                if (!author[e.name]) {
                                    author[e.name] = e.perDayViews;
                                } else {
                                    author[e.name] += e.perDayViews;
                                }
                            });
                            console.log(author);
                            var perDayViewsArr = result.map(function (e) {
                                return e.perDayViews
                            });
                            var durationArr = result.map(function (e) {
                                return e.duration
                            });
                            var perDayViewsCount = perDayViewsArr.reduce(function (e1, e2) {
                                return e1 + e2
                            });
                            var durationCount = durationArr.reduce(function (e1, e2) {
                                return e1 + e2
                            });
                            var perDayViewsAvg = perDayViewsCount / perDayViewsArr.length;
                            var durationAvg = durationCount / durationArr.length;
                            var perDayViewsVariance = perDayViewsArr.reduce(function (e1, e2) {
                                return e1 + (e2 - perDayViewsAvg) * (e2 - perDayViewsAvg)
                            }, 0) / perDayViewsArr.length;
                            var durationVariance = durationArr.reduce(function (e1, e2) {
                                return e1 + (e2 - durationAvg) * (e2 - durationAvg)
                            }, 0) / durationArr.length;
                            var xfc = result.reduce(function (e1, e2) {
                                return e1 + (e2.perDayViews - perDayViewsAvg) * (e2.duration - durationAvg)
                            }, 0) / perDayViewsArr.length;
                            var xgx = xfc / Math.pow(perDayViewsVariance * durationVariance, 0.5);
                            console.log("日均浏览量与持续时间相关性：" + xgx);
                        });
                    });
                },
                take: function (reword) {
                    $.ajax({
                        url: '//jingyan.baidu.com/patchapi/claimQuery',
                        data: {
                            queryId: reword.queryid,
                            token: F.context().BdStoken,
                            timestamp: F.context().bdstt
                        },
                        success: function (data) {
                            if (data.errno == 302) {
                                alert('领取失败，只能领取一条');
                            } else if (data.errno == 0) {
                                alert('领取成功');
                            } else {
                                alert('领取失败，错误码' + data.errno);
                            }
                        }
                    });
                },
                clear: function () {
                    if (this.clearRange === "all") {
                        this.rewordList = [];
                    } else if (this.clearRange === "50") {
                        this.rewordList = this.rewordList.filter(reword => {
                            return (+reword.perDayViews) > 50;
                        });
                    } else if (this.clearRange === "50%") {
                        this.rewordList = this.showRewordList.slice(0, Math.round(this.showRewordList.length / 2));
                    } else if (this.clearRange === "100") {
                        this.rewordList = this.showRewordList.slice(0, 1000);
                    }
                },
                remove: function (reword) {
                    this.rewordList.splice(reword.index, 1);
                },
                removeWord: function (word_index) {
                    this.allWords.splice(word_index, 1);
                    this.searchWords = this.searchWords.filter(word => {
                        return this.allWords.includes(word);
                    });
                },
                addWord: function () {
                    if (this.toAddWord.trim()) {
                        let set = new Set(this.allWords);
                        set.add(this.toAddWord);
                        this.allWords = Array.from(set);
                    }
                },
                listPageArticles: function (body) {
                    return {
                        articleUrls: $(body).find(".t")
                            .toArray()
                            .filter(e => !$(e).hasClass('SiKTuq'))
                            .map(e => $(e).find('a').attr('href'))
                    }
                },
                paramsToSearchUrl: function (word, pn, startTime, endTime) {
                    /*
                    JSON.stringify('wd=%E7%AC%AC%E4%BA%94%E4%BA%BA%E6%A0%BC&pn=10&oq=%E7%AC%AC%E4%BA%94%E4%BA%BA%E6%A0%BC&ct=2097152&ie=utf-8&si=jingyan.baidu.com&rsv_idx=1&rsv_pq=822fa42900038620&rsv_t=6c4dOj7hutO0DbBLzqLSvERKWYymTrJUiJ82cE31aQYtFw6k3fEzWFhZw0E&gpc=stf%3D1522512000%2C1523635198%7Cstftype%3D2&tfflag=1'.split('&').map(e=>{return {key:e.split('=')[0],value:e.split('=')[1]}}))
                    */

                    //
                    let params = [
                        {
                            "key": "wd",
                            "value": encodeURIComponent(word + ' inurl:jingyan.baidu.com/article')
                        },
                        // {
                        //     "key": "si",
                        //     "value": "jingyan.baidu.com"
                        // },
                        {
                            "key": "ct",
                            "value": "2097152"
                        }
                    ];
                    if (pn) {
                        params.push({
                            "key": "pn",
                            "value": pn
                        });
                    }
                    if (startTime) {
                        if (!endTime) {
                            endTime = new Date().valueOf();
                        }
                        params.push({
                            "key": "gpc",
                            "value": `stf%3D${new Date(startTime).valueOf() / 1000 | 0}%2C${new Date(endTime).valueOf() / 1000 | 0}%7Cstftype%3D1`
                        },);
                    }

                    let paramsStr = params.map(e => e.key + '=' + e.value).join('&');
                    return 'https://www.baidu.com/s?' + paramsStr;
                },
                defaultViewWord(word) {
                    return this.paramsToSearchUrl(word, null, new Date().valueOf() - 1000 * 60 * 60 * 24 * 7)
                },
                selectAll() {
                    this.searchWords = [...this.allWords];
                },
                unselectAll() {
                    this.searchWords = [];
                },
            }
        });
    }
});