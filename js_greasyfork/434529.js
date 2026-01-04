// ==UserScript==
// @name         ZD-price
// @description  ZD-隐藏多余元素
// @namespace    http://www.zhundianyinwu.com/LunaServer/cusClient/indexClient.jsp?type=mingPian&selectType=artpaper
// @version      1.4
// @author       You
// @match        http://www.zhundianyinwu.com/*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/434529/ZD-price.user.js
// @updateURL https://update.greasyfork.org/scripts/434529/ZD-price.meta.js
// ==/UserScript==



(function() {
    //初始CSS
    (document.head || document.documentElement).insertAdjacentHTML('beforeend', '<style>.logo, .pull-right, #banner, .itemList, .footer_top, .container, #productNotice, #fileWrap, .pro-num-type, .address-wrap { display: none!important; } .pro-price-item{color:rgba(0,0,0,.1)!important;} .newJ{color:gray;font-weight: normal;font-size:12px} .nav-wrap{background:#363636!important;} .nav-item-link{border:none!important;} .jNavCurr{color:rgba(255,255,255,.5)!important; background:rgba(0,0,0,.5)!important}  .nav-item-link:hover{background:rgba(0,0,0,.5)!important} .nav-item-link{color: rgba(255,255,255,0.5)!important;} .nav-item-name{background:none!important;border:none!important} .tab-box{background: #363636!important;} .jTabCurr{background: rgba(0,0,0,.5)!important;color: rgba(255,255,255,.5)!important; border:none!important;} .tab-refresh, .tab-cloOth{color:#ffffff3d!important} .tab-wrap-det{background:none!important} .pro-type-ttl, .pro-types-name{    color: #363636!important;padding: 0px 5px !important; background: rgba(0,0,0,.06)!important;} .tab-wrap-det > li{color: #adadad!important;} .tab-wrap-det li.tabCurr{border:none!important} .tab-wrap-det li.tabCurr p{color: #363636!important;} .pro-num-ttl{    background: #363636!important;} .pro-types-name>span.pro-num-ttl:last-child{background:none!important;background: none!important;color: #363636!important;border: none!important;} .pro-wrap-num .pro-type-list.numSel, .pro-wrap-num .pro-type-list:hover{border: 2px solid #363636!important;} .account-b{background:none!important} .tab-item.jTabCurr .jTabClose{background:none!important;} .index-l h1{flex: 0 0 0px; display:none;} .version{color: #ffffff66;padding: 20px;font-size: 12px;text-align: center;position: absolute;left: 84px;z-index: 9999999;top: 30px;cursor: pointer;}</style> ');
    //插入html




    //初始参数............
    //第几次计算：
    var nn = 0;
    //不同价格种类
    var jiaSum;

    $(function() {
        //版本号
        var version = '1.3';


        //左栏修改///////////////////////////////////////
        //改变LOGO===================
        $('.index-l h1').remove();
        $('.index-l').prepend('<div class="inhand" style="display:block!important;background: #363636!important;color:orange;padding:20px;font-size: 24px;text-align: center;">应恒广告</div>')






        //jquery等待特定元素加载再执行相关函数=======================
        //默认是执行100次，每次间隔20毫秒，最长等待时间是2000毫秒（2秒），如果要一直等待到元素出现，可以将100改成任意负数。
        jQuery.fn.wait = function(func, times, interval) {
            var _times = times || 100, //100次
                _interval = interval || 20, //20毫秒每次
                _self = this,
                _selector = this.selector, //选择器
                _iIntervalID; //定时器id
            if (this.length) { //如果已经获取到了，就直接执行函数
                func && func.call(this);
            } else {
                _iIntervalID = setInterval(function() {
                    if (!_times) { //是0就退出
                        clearInterval(_iIntervalID);
                    }
                    _times <= 0 || _times--; //如果是正数就 --
                    _self = $(_selector); //再次选择
                    if (_self.length) { //判断是否取到
                        func && func.call(_self);
                        clearInterval(_iIntervalID);
                    }
                }, _interval);
            }
            return this;
        }

        //等待元素出现后再执行的代码
        $(".pro-wrap-time").wait(function() {
            console.log('检查到iframe最下面的一个class出现后再执行下列代码：')


/*
        setTimeout(() => {
       // 自动点击显示价格===========
            var jiaAutoClick = $('.pro-price-item').length;
                        for (var i = 0; i <= jiaAutoClick; i++) {
                           $(".pro-price-item").eq(i).trigger("click");
                }
       }, 2000);
*/



            // 初始计算新价格================
            setTimeout(() => {
                jiaSum = $('.pro-price-item').length;
                autoJ();
            }, 500);


            //隐藏配送选择=================
            var peishongSum = $('.pro-types-name').length;
            for (var i = 0; i <= peishongSum; i++) {
                var nowText = $(".pro-types-name").eq(i).text();
                if (nowText.indexOf("配送信息") >= 0 || nowText.indexOf("产品介绍") >= 0) {
                    $(".pro-types-name").eq(i).parent().parent().css('display', 'none');
                }
                //隐藏产品介绍标题栏
                //$('#productNotice').parent().parent().parent().remove();
            }


/*
            //版本检查提示更新
            $('#clientContent').prepend('<div class="myDiv" style="display:block;position:absolute;bottom: 20px; right: 10px; text-align:center; font-size:12px" ><img src="https://tools.yourongs.com/monkey/' + version + '.jpg" class="myPic" style="display:none"><br><a class="dontUp" style="display:none;"><img src="https://tools.yourongs.com/monkey/img.jpg"><br>插件已最新 V' + version + '</a><a href="https://greasyfork.org/zh-CN/scripts/434529-zd-price" target="_blank" class="NeedUp" style="color:red; display:none;"><img src="https://tools.yourongs.com/monkey/needUp.gif" style="width:50px; height:50px"><br><br>有新版，点击升级插件！</a></div>')

            setTimeout(() => {
                var myPicH = $('.myPic').height();
                if (myPicH == 85) {
                    console.log('有图显示')
                    $('.dontUp').css('display', 'block');
                    $('.needUp').css('display', 'none');

                } else {
                    console.log('无图显示')
                    $('.dontUp').css('display', 'none');
                    $('.needUp').css('display', 'block');
                }
            }, 2000);
*/




        })


        //当键盘弹起和鼠标点击都会重新计算
        $('.ipt1, .ui-select-option').keyup(function() {
            setTimeout(() => { autoJ() }, 300);
        })

        $('body').mouseup(function() {


        /*
       setTimeout(() => {
       // 自动点击显示价格===========
            var jiaAutoClick = $('.pro-price-item').length;
                        for (var i = 0; i <= jiaAutoClick; i++) {
                           $(".pro-price-item").eq(i).trigger("click");
       }
       }, 2000);
*/


            setTimeout(() => {
                autoJ();
                console.log('第' + nn + '次计算');
                nn++;
            }, 0);
        })

        function autoJ() { //待优化：把等待0.5s改成 条件判断执行效率和稳定性更高
            setTimeout(() => {
                $('.newJ').remove(); //先清空 再重新计算
                for (var i = 0; i <= jiaSum; i++) {
                    var newJia = parseInt($('.pro-price-item').eq(i).text());
                    $('.pro-price-item').eq(i).append('<span class="newJ"><br>建议: ' + parseInt(newJia * 2.5) + '<br>最低: ' + parseInt(newJia * 1.8) + '</span>');
                }
            }, 500);
        }



  var keyCode;
    var isCtrl = false;
    document.onkeydown = function (e) {
        if (!keyCode) {
            if (window.event) {
                keyCode = event.keyCode;
            } else if (e.which) {
                keyCode = e.which;
            }
            if (keyCode === 17) {
                isCtrl = true;
            }
            if (keyCode === 192) { //自动点击显示价格
                var jiaAutoClick = $('.pro-price-item').length;
           for (var i = 0; i <= jiaAutoClick; i++) {
               $(".pro-price-item").eq(i).trigger("click");
                }
                jiaSum = $('.pro-price-item').length;
                autoJ();
            }
            console.log("key1：" + keyCode+",isCtrl："+isCtrl);
        }
    };

    document.onkeyup = function () {
        if (keyCode) {
            keyCode = undefined;
        }
    };








    });


})();