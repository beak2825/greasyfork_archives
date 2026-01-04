// ==UserScript==
// @name         报名工具
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://xc.k12online.net/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406369/%E6%8A%A5%E5%90%8D%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/406369/%E6%8A%A5%E5%90%8D%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here..
   // setTimeout( function () {
   //     var eles = document.getElementsByClassName('btn-ready');

   //     console.log(eles);
        //console.log(eles.length);
        //console.log(eles[0].innerText);
   //     var ele = eles[0]
    //    ele.innerText = "开始报名"
    //    ele.className = 'btn btn-ing btn-start';
    //    ele.disabled = false
   // }, 1000)
window.onload = function () {
    var appVue = new Vue({
        el: '#app',
        data: {
            name: '',
            orgName: '',
            introduction: '',
            introductionTitle: '',
            introductionTime:'',
            nextIntroduction: {},
            registrationNoticeTitle: '',
            noIntroduction: '',

            applyList: [],
            homeApplyList: [],

            announcementList: [],
            introductionDetail: '',
            introductionDetailTitle: '',
            introductionDetailTime:'',
            introductionShow: false,

            questionList: [],

            resultList: [],
            resultShow: false,

            nowTime: '',//系统时间
            nowS: '',

            list1: [],
            list2: [],
            signBtnMsg: '开始报名',
            countdownMsg: '',
            configEnd: '',//结束日期
            cinfigStart: '',//开始日期

            cfgId: '',

            hostUrl: hostUrl,
            noMsg: '信息核实中，请耐心等待...',

            isStart: false,
            nextConfig: '',
            timers: [],
            showLogo:false,
            iconClose:'../src/img/icon-close.png',
            defaultColor:'#00D34D',
            showIco:true
        },
        created: function () {
            var _this = this
            //_this.getTime()
            _this.getConfig()
        },
        mounted: function () {
            var _this = this;

            //_this.init()


            _this.getHome()
            _this.getApply(1)
            _this.getAnnouncement(1)
            //_this.getQuestion(1)
            var host = window.location.hostname;
            if (host === 'by.k12online.net') {
                _this.showLogo = true;
                _this.iconClose= '../src/img/icon-close2.png';
                _this.defaultColor = '#1C4375';
            } else if (host === 'jx.k12online.net') {
                _this.showLogo = true;
                _this.iconClose= '../src/img/icon-close2.png';
                _this.defaultColor = '#1C4375';
            } else if(host === 'xy.k12online.net'){
                _this.showLogo = true;
                _this.iconClose= '../src/img/icon-close3.png';
                _this.defaultColor = '#FFBDB1';
                _this.showIco = false;
            }
        },
        methods: {

            /**
             *
             */
            init: function () {
                var _this = this
                var res = localStorage.getItem('res') ? localStorage.getItem('res') : 0;
                switch (parseInt(res)) {
                    case 0:
                        $('#myTab1').click()
                        break
                    case 5:
                        var id = localStorage.getItem('configId')
                        _this.getResult(id)
                        $('#resultShow').removeClass('hidden')
                        this.resultShow = true
                        break
                }

                localStorage.clear()

            },

            /**
             * 获取幼儿园信息
             */
            getConfig: function () {
                var _this = this

                requestJson(
                    '/get-kindergarten',
                    'POST',
                    null,
                    null,
                    function (res) {
                        _this.orgName = res.data.name
                        //localStorage.setItem('orgName',_this.orgName)
                        _this.nowTime = res.data.nowTime
                        _this.getStarTime()
                    },
                    function (res) {

                    }
                )
            },

            /**
             *获取首页公告及配置
             */
            getHome: function () {
                var _this = this;

                requestJson(
                    '/first-bulletin',
                    'POST',
                    null,
                    null,
                    function (res) {
                        console.log(res)
                        if (res.data) {
                            _this.introduction = res.data.introduction
                            _this.introductionTitle = res.data.title
                            _this.introductionTime = res.data.updateTime
                        } else {
                            _this.noIntroduction = '暂 无 公 告'
                        }
                    },
                    function (res) {

                    }
                )
            },

            /**
             * 获取报名列表
             */
            getApply: function (num) {
                var _this = this;

                requestJson(
                    '/index/page-configs',
                    'POST',
                    JSON.stringify({
                        pageNum: num,
                        pageSize: 9
                    }),
                    null,
                    function (res) {
                        if (res.data) {
                            var list = res.data.list
                            for (var i = 0; i < list.length; i++) {
                                list[i].end = list[i].config.configEnd.split(' ')[1]
                                list[i].config.status = "OPEN"
                            }
                            _this.applyList = list

                            if (num === 1) {
                                if (list.length > 4)
                                    _this.homeApplyList = list.slice(0, 4)
                                else _this.homeApplyList = list
                            }

                            $("#applyPagination").sPage({
                                page: num,
                                pageSize: 9,
                                total: res.data.total,
                                prevPage: "←",
                                nextPage: "→",
                                backFun: function (page) {
                                    _this.getApply(page)
                                }
                            });

                            setTimeout(function () {
                                _this.renderTab(_this.applyList, 'li')
                                _this.renderTab(_this.homeApplyList, 'homeLi')
                            }, 200)

                        }
                    },
                    function (res) {

                    }
                )
            },

            tabGet: function (type) {
                switch (type) {
                    case 1:
                    case 2:
                    case 3:
                        $('#introductionShow').addClass('hidden')
                        this.introductionShow = false
                    case 4:
                        $('#introductionShow').addClass('hidden')
                        this.introductionShow = false
                        if (this.questionList.length === 0)
                            this.getQuestion(1)
                        break
                }
            },

            /**
             * 获取公告列表
             */
            getAnnouncement: function (num) {
                var _this = this;

                requestJson(
                    '/bulletin/list',
                    'POST',
                    JSON.stringify({
                        pageNum: num,
                        pageSize: 10
                    }),
                    null,
                    function (res) {
                        if (res.data) {
                            _this.announcementList = res.data.list
                            if (_this.announcementList.length > 1 && num === 1)
                                _this.nextIntroduction = res.data.list[1]
                            $("#announcementPagination").sPage({
                                page: num,
                                pageSize: 10,
                                total: res.data.total,
                                prevPage: "←",
                                nextPage: "→",
                                backFun: function (page) {
                                    _this.getAnnouncement(page)
                                }
                            });
                        }
                    },
                    function (res) {

                    }
                )
            },

            /**
             * 获取问答列表
             */
            getQuestion: function (num) {
                var _this = this;

                requestJson(
                    '/index/page-qa',
                    'POST',
                    JSON.stringify({
                        pageNum: num,
                        pageSize: 10
                    }),
                    null,
                    function (res) {
                        if (res.data) {
                            var list = res.data.list
                            for (var i = 0; i < list.length; i++) {
                                list[i].collapse = 'collapse' + i
                                list[i].open = true
                            }
                            _this.questionList = list

                            $("#questionPagination").sPage({
                                page: num,
                                pageSize: 10,
                                total: res.data.total,
                                prevPage: "←",
                                nextPage: "→",
                                backFun: function (page) {
                                    _this.getQuestion(page)
                                }
                            });
                        }
                    },
                    function (res) {

                    }
                )
            },

            /**
             * 获取名单
             */
            getResult: function (cfgId) {
                var _this = this

                requestJson(
                    '/enroll/list',
                    'POST',
                    JSON.stringify({
                        cfgId: cfgId,
                    }),
                    null,
                    function (res) {
                        _this.resultList = res.data
                        _this.viewDetail(null, 2)
                    },
                    function (res) {

                    }
                )
            },

            /**
             * 查看详情
             * @param obj
             */
            viewDetail: function (obj, type) {
                switch (type) {
                    case 1:
                        $('#introductionShow').removeClass('hidden')
                        this.introductionDetail = obj.introduction
                        this.introductionDetailTitle = obj.title
                        this.introductionDetailTime = obj.updateTime
                        this.introductionShow = true
                        break
                    case 2:
                        $('#resultShow').removeClass('hidden')
                        this.resultShow = true
                        break
                }

            },

            /**
             * 返回列表操作
             */
            returnList: function (type) {
                switch (type) {
                    case 1:
                        $('#introductionShow').addClass('hidden')
                        this.introductionShow = false
                        break;
                    case 2:
                        $('#resultShow').addClass('hidden')
                        this.resultShow = false
                        break;
                }
            },

            /**
             *  查看更多
             */
            viewMore: function (type) {
                switch (type) {
                    case 1:
                        $('#myTab3').click()
                        break;
                    case 2:
                        $('#myTab2').click()
                        break;
                }
            },

            /**
             *
             */
            ifEmpty: function (da) {
                return da ? da : ''
            },

            /**
             *渲染报名列表
             */
            renderTab: function (list, el) {
                var _this = this;
                var _liHtml = '';

                if (el === 'li') {
                    $('#applyUl').html('')

                } else {
                    $('#homeApplyUl').html('')
                }

                for (var i = 0; i < list.length; i++) {
                    var item = list[i]
                    _liHtml += '<li>'
                    _liHtml += '<div class="apply-item-div">'
                    _liHtml += '<div class="apply-item-time">'
                    if (item.config.status === 'NOOPEN') {
                        _liHtml += '<div><p id="' + el + i + '"></p></div></div>'
                    } else if (item.config.status === 'FULL') {
                        _liHtml += '<div style="background: #F4F5F7"><p style="color: #B3BBCA">报名已满</p></div></div>'
                    } else if (item.config.status === 'OPEN') {
                        _liHtml += '<div><p>报名进行中</p></div></div>'
                    } else if (item.config.status === 'CLOSE') {
                        _liHtml += '<div style="background: #F4F5F7"><p style="color: #B3BBCA">报名已结束</p></div></div>'
                    }
                    _liHtml += '<div class="apply-item-pad">'
                    /*_liHtml += '<p class="apply-item-p1">2020</p>'*/
                    _liHtml += '<p class="apply-item-p2">' + item.config.orgName + '</p>'
                    _liHtml += '<p class="apply-item-p3">幼儿出生日期：' + item.config.birthStart + '至' + item.config.birthEnd + '</p>'
                    _liHtml += '<p class="apply-item-p3 apply-item-p4">报名时间：' + item.config.configStart + '-' + item.end + '</p>'
                    _liHtml += '<p class="apply-item-p3 apply-item-p5">学位数量：' + (parseInt(item.totalCount)-parseInt(item.remainCount)) + '/' + item.totalCount + '</p></div>'
                    _liHtml += '<div class="apply-item-pad" style="margin-top: 37px">'
                    if (item.config.status === 'NOOPEN') {
                        _liHtml += '<button class="btn btn-ready" disabled>报名未开始</button></div>'
                    } else if (item.config.status === 'OPEN') {
                        _liHtml += '<button class="btn btn-ing btn-start" data-id="' + item.config.id + '">开始报名</button>'
                        _liHtml += '<button class="btn btn-ing btn-result" data-id="' + item.config.id + '">查看名单</button></div>'
                    } else if (item.config.status === 'FULL' || item.config.status === 'CLOSE') {
                        _liHtml += '<button class="btn btn-ing btn-result" data-id="' + item.config.id + '" style="width: 100%">查看名单</button></div>'
                    }

                    _liHtml += '</li>'
                }

                if (el === 'li') {
                    $('#applyUl').append(_liHtml)

                } else {
                    $('#homeApplyUl').append(_liHtml)
                }

                _this.cycleTimer(list, el)
            },

            /**
             *渲染首页报名列表
             */
            renderTabHome: function () {
                var _this = this;
                var _liHtml = '';

                $('#homeApplyUl').html('')

                for (var i = 0; i < _this.homeApplyList.length; i++) {
                    var item = _this.homeApplyList[i]
                    _liHtml += '<li>'
                    _liHtml += '<div class="apply-item-div">'
                    _liHtml += '<div class="apply-item-time"><div>'
                    if (item.status === 'NOOPEN') {
                        _liHtml += '<p id="homeLi' + i + '"></p></div></div>'
                    } else if (item.status === 'FULL') {
                        _liHtml += '<p>报名已满</p></div></div>'
                    } else if (item.status === 'OPEN') {
                        _liHtml += '<p>报名进行中</p></div></div>'
                    } else if (item.status === 'CLOSE') {
                        _liHtml += '<p>报名已结束</p></div></div>'
                    }
                    _liHtml += '<div class="apply-item-pad">'
                    /*_liHtml += '<p class="apply-item-p1">2020</p>'*/
                    _liHtml += '<p class="apply-item-p2">' + item.orgName + '</p>'
                    _liHtml += '<p class="apply-item-p3">幼儿出生日期：' + item.birthStart + '至' + item.birthEnd + '</p>'
                    _liHtml += '<p class="apply-item-p3 apply-item-p4">报名时间：' + item.configStart + '-' + item.end + '</p>'
                    _liHtml += '<p class="apply-item-p3 apply-item-p5">学位数量：' + item.childNumber + '</p></div>'
                    _liHtml += '<div class="apply-item-pad" style="margin-top: 37px">'
                    if (item.status === 'NOOPEN') {
                        _liHtml += '<button class="btn btn-ready" disabled>报名未开始</button></div>'
                    } else if (item.status === 'OPEN') {
                        _liHtml += '<button class="btn btn-ing btn-start">开始报名</button>'
                        _liHtml += '<button class="btn btn-ing btn-result">查看名单</button></div>'
                    } else if (item.status === 'FULL' || item.status === 'CLOSE') {
                        _liHtml += '<button class="btn btn-over btn-result">查看名单</button></div>'
                    }

                    _liHtml += '</li>'
                }

                $('#homeApplyUl').append(_liHtml)

                _this.cycleTimer()
            },

            /**
             *报名列表倒计时效果
             */
            cycleTimer: function (list, el) {
                var _this = this;

                var times = _this.nowS

                console.log(times)

                var timer;
                timer = setInterval(function () {

                    for (var i = 0; i < list.length; i++) {

                        var sTimt = list[i]
                        var conS = _this.comTimer(times, sTimt.config.configStart)

                        if (conS <= 0 && sTimt.config.status === 'NOOPEN') {
                            window.clearInterval(timer)
                            //$('#tabR').find('tr').eq(i).addClass('hidden')
                            //window.location.reload()
                            _this.getApply(1)
                        }

                        var day = _this.totwo(Math.floor(conS / 86400));// 差值/60/60/24获取天数
                        var hour = _this.totwo(Math.floor(conS % 86400 / 3600)); //  取余/60/60获取时(取余是获取conS对应位置的小数位)
                        var min = _this.totwo(Math.floor(conS % 86400 % 3600 / 60));// 取余/60获取分
                        var s = _this.totwo(Math.floor(conS % 60)); //取总秒数的余数
                        var _html = ''

                        if (day > 0) {
                            _html += day + "天"
                        } else {
                            _html += "0天"
                        }

                        if (hour > 0) {
                            _html += hour + "时"
                        } else {
                            _html += "0时"
                        }
                        if (min > 0) {
                            _html += min + "分"
                        } else {
                            _html += "0分"
                        }
                        if (s > 0) {
                            _html += s + "秒"
                        } else {
                            _html += "0秒"
                        }

                        if (document.getElementById(el + i)) {

                            document.getElementById(el + i).innerText = _html
                        }

                    }

                    times += 1000
                }, 1000)
            },

            /**
             *
             */
            comTimer: function (times, dt) {

                var ye = parseInt(dt.split(' ')[0].split('-')[0])
                var mo = parseInt(dt.split(' ')[0].split('-')[1]) - 1
                var da = parseInt(dt.split(' ')[0].split('-')[2])

                var ho = parseInt(dt.split(' ')[1].split(':')[0])
                var mi = parseInt(dt.split(' ')[1].split(':')[1])
                var ss = parseInt(dt.split(' ')[1].split(':')[2])

                var time2 = new Date(ye, mo, da, ho, mi, ss);//设置需要到达的时间 也是获取的毫秒数
                //var time2 = new Date(2019, 3, 8, 20,15);
                var conS = Math.floor((time2.getTime() - times) / 1000);//获得差值除以1000转为秒
                return conS
            },

            /**
             * 系统时间取秒
             */
            getStarTime: function () {
                var _this = this;
                var sye = parseInt(_this.nowTime.split(' ')[0].split('-')[0])
                var smo = parseInt(_this.nowTime.split(' ')[0].split('-')[1]) - 1
                var sda = parseInt(_this.nowTime.split(' ')[0].split('-')[2])

                var sho = parseInt(_this.nowTime.split(' ')[1].split(':')[0])
                var smi = parseInt(_this.nowTime.split(' ')[1].split(':')[1])
                var sss = parseInt(_this.nowTime.split(' ')[1].split(':')[2])

                var time1 = new Date(sye, smo, sda, sho, smi, sss)

                _this.nowS = time1.getTime()

            },

            totwo: function (e) {
                return e < 10 ? "0" + e : "" + e;//如果取得的数字为个数则在其前面增添一个0
            },

            /**
             *
             */
            intoSign: function (id) {

                $('#loadIngModal').modal('show')

                setTimeout(function () {
                    window.location.href = '../view/registration.html?configId=' + id
                }, 300)
            },

            collapse: function (e, item) {
                console.log(e.currentTarget.className)
                item.open = !item.open
                if (e.currentTarget.className.indexOf('collapsed') > -1) {
                    e.currentTarget.style.color = this.defaultColor
                } else {
                    e.currentTarget.style.color = '#18172F'
                }
            },

            /**
             * 跳转工信部
             */
            jump: function () {
                window.open('http://www.beian.miit.gov.cn/', '_blank')
            }
        }
    })

    $(document).on('click', '.btn-result', function () {
        var id = $(this).attr('data-id')
        window.open('../view/registration-list.html?configId=' + id, "_blank");
    })

    $(document).on('click', '.btn-start', function () {
        var id = $(this).attr('data-id')
        console.log(id)
        appVue.intoSign(id)
    })
}

})();