// ==UserScript==
// @name         智学网后台调整
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  自用!
// @author       小木
// @match        http://jkxs.hbxqzhjy.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/461786/%E6%99%BA%E5%AD%A6%E7%BD%91%E5%90%8E%E5%8F%B0%E8%B0%83%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/461786/%E6%99%BA%E5%AD%A6%E7%BD%91%E5%90%8E%E5%8F%B0%E8%B0%83%E6%95%B4.meta.js
// ==/UserScript==

// 防止jq冲突
this.$ = this.jQuery = jQuery.noConflict(true);

// JQ
jQuery.fn.wait = function (func, times, interval) {
    var _times = times || 100, //100次
        _interval = interval || 20, //20毫秒每次
        _self = this,
        _selector = this.selector, //选择器
        _iIntervalID; //定时器id
    if( this.length ){ //如果已经获取到了，就直接执行函数
        func && func.call(this);
    } else {
        _iIntervalID = setInterval(function() {
            if(!_times) { //是0就退出
                clearInterval(_iIntervalID);
            }
            _times <= 0 || _times--; //如果是正数就 --
            _self = $(_selector); //再次选择
            if( _self.length ) { //判断是否取到
                func && func.call(_self);
                clearInterval(_iIntervalID);
            }
        }, _interval);
    }
    return this;
}

// 页面样式调整
function addStyle() {
    let css = `
		div.footer{display:none}
h3.before-title.fl{margin-top:0;margin-bottom:0}
div.form-inline.new-form-inline{margin-bottom:5px}
h2.new-table-tip{display:none}
div.fl{height:20px}
div.txt-more.clearfix{margin-top:5px}
div ul li{padding-top:5px}
ul li h2{margin-bottom:5px}
div.clearfix{padding-top:0;padding-bottom:0}
div.view-memo{display:none}
p.current-user{display:none}
div.content_top{display:none}
div.question{margin:0px;padding-bottom:10px}
li.pre1,li.pre2,li.pre3,li.pre4,li.pre5,li.pre6,li.pre7,li.pre8{margin-top:5px}
div.remark-box{display:none}
.title-line{border-bottom:0px;width:50%}
img.point-left{display:none}
img.point-right{display:none}
div div strong{top:5px}
.form-item{margin:5px !important}
li.stu-name{padding:0px;margin:4px!important;width:80px !important}
.form-item .sel-list{padding-top: 20px!important;}
button.color-blue{font-size:30px}
.new-common-list li h2{margin-bottom:4px}
.new-common-list li{padding:4px 20px 4px;margin-bottom:4px}
.new-common-list li .txt-more{padding:0px 20px !important}
.user-account{margin-top:0px !important}
.function-list .function{top:5px !important;margin-top:0px !important}
.news-list{margin-top:0px !important}
.function-list .function .function-details li a{padding:0px !important;margin:0px !important}
.container{margin-top:0px  !important}
.edit-list .z-uploaded{margin-top:0px !important}
.sc-preview{margin-top:0px !important}
.que-list li .question{margin:6px 10px 6px !important}
.que-list li .anser{padding:0 20px 0px !important}
.que-list textarea{margin:0px 0 0 !important;padding:10px !important}
    `;
    GM_addStyle(css);
}

// 调整列表隐藏
function hide_ul_li() {
    let sec = 1000;

    let ul_li = $('#content ul.new-common-list').find('li');
    //console.log( ul_li );

    for(let i=0;i<ul_li.length;i++){
        //console.log( ul_li.eq(i) );

        // 隐藏 教师填写
        if(ul_li.eq(i).find(".tips-teacher-task").length != 0 ){
            let html1 = ul_li.eq(i).find(".tips-teacher-task")[0].innerHTML;
            if( html1 == "该记录为教师填报"){
                //console.log( html1 );
                ul_li.eq(i).hide(sec);
            }
        }

        // 隐藏 未开始
        let html2 = ul_li.eq(i).find("h2")[0].innerHTML;
        if( ul_li.eq(i).find("h2")[0].innerHTML.indexOf("未开始") >= 0 ) {
            //console.log( html2 );
            ul_li.eq(i).hide(sec);
        }

        // 隐藏 超时未投票
        let html3 = ul_li.eq(i).find('dt').find("a[disabled='disabled']")[0];
        if( html3 ){
            ul_li.eq(i).hide(sec);
        }
    }
}

// 切换分页
function clickPage(){
    //console.log( $('.autoClickPage') );
    if($('.autoClickPage').length == 0){
        $("li.ivu-select-item").eq( $("li.ivu-select-item").length-1 ).click();
        $("span.ivu-select-selected-value").addClass("autoClickPage");
    }
}

// 随机数
function create_random(count,x,y) {
    let num = [];
    for(let i = 0; i < count; i++){
        num[i] = Math.floor(Math.random()*x) + y;
        for(let j = 0; j < i; j++){
            if(num[i] == num[j]){
                i--
            }
        }
    }
    return num;
}



// 随机选择投票人
function addAutoVoteBtn(){
    if($('#autoVoteBtn').length == 0){
        //console.log("随机选择投票人！");
        $("button.vote-btn").before('<button id="autoVoteBtn" style="background: #50b5a9;border: 1px solid #50b5a9;color: #fff;margin-right: 40px; width: 110px;height: 36px;border-radius: 4px;" >随机选择</button>');
        $("#autoVoteBtn").click(function(){
            let el =  $("ul.stu-list li.stu-name");
            let rand = create_random(9,el.length,0);

            for(let i=0; i<rand.length; i++){
                el.eq(rand[i]).click();
                //console.log( el[i].innerHTML );
                if( i == rand.length-1 ){
                    $("button.vote-btn").click();
                }
            }
        });
    }
}

function autoWrite(){
    if($("p:contains(自我评价)").next().find("textarea").text() == ''){
        $("p:contains(自我评价)").next().find("textarea").attr("id","Self-evaluation");
        $("#Self-evaluation").val("表现优秀");
        $("#Self-evaluation").focus();
    }

    if($("p:contains(亲子共评)").next().find("textarea").text() == ''){
        $("p:contains(亲子共评)").next().find("textarea").attr("id","Parent-child-evaluation");
        $("#Parent-child-evaluation").val("表现优秀");
        $("#Parent-child-evaluation").focus();
    }
}

// 自动选择选项
// function autoChoose(){
// $("p:contains(读书笔记)").parent().parent().find("a.fl").eq(0).click();
//     console.log(    $("p:contains(读书笔记)").parent().parent().find("a.fl")   );
// }

// 填充文字
function writeShiJian(text){
    let el =  $("input.zhpj_input");
    el.eq(0).val(text[0]);
    el.eq(1).val(text[1]);
    el.eq(2).val(text[2]);
    el.eq(3).val(text[3]);
}

// 添加自动成长记录按钮
function addAutoGrowUpBtns(){
    if($('#addAutoGrowUpBtns').length == 0){
        //console.log("随机选择投票人！");
        let html = '<box id="addAutoGrowUpBtns">';
        html += '<a id="addAutoGrowUpBtns_1" style="background: #50b5a9;border: 1px solid #50b5a9;color: #fff;margin-right: 40px; width: 110px;height: 36px;border-radius: 4px;" >学雷锋</a>';
        html += '<a id="addAutoGrowUpBtns_2" style="background: #50b5a9;border: 1px solid #50b5a9;color: #fff;margin-right: 40px; width: 110px;height: 36px;border-radius: 4px;" >植树节</a>';
        html += '<a id="addAutoGrowUpBtns_3" style="background: #50b5a9;border: 1px solid #50b5a9;color: #fff;margin-right: 40px; width: 110px;height: 36px;border-radius: 4px;" >社团</a>';
        html += '<a id="addAutoGrowUpBtns_4" style="background: #50b5a9;border: 1px solid #50b5a9;color: #fff;margin-right: 40px; width: 110px;height: 36px;border-radius: 4px;" >榜样</a>';
        html += '</box>';

        //console.log(      html       )
        $("a:contains(保存)").eq(0).before(html);

        $("#addAutoGrowUpBtns_1").click(function(){
            writeShiJian( ['3.5','校外','学雷锋','150'] )
        });
        $("#addAutoGrowUpBtns_2").click(function(){
            writeShiJian( ['3.15','校外','植树节','150'] )
        });
        $("#addAutoGrowUpBtns_3").click(function(){
            let shetuan = ['象棋社团','围棋社团','书法社团','唱歌社团','唱歌社团'];
            let el =  $("input.zhpj_input");
                el.eq(0).val(shetuan[Math.floor(Math.random()*4) + 0]);
                el.eq(1).val('2.1');
                el.eq(2).val('7.1');
                $("#element").val('优秀');
        });

         $("#addAutoGrowUpBtns_4").click(function(){
            let bangyang = ["陈柃旭","浦咏琪","乔斌瑜","张诗晨","刘俊李","张曼","马盎然","曹政雲","彭圣杰","张子成","赵宇阳","戈鹏宇","吴家全","郭毓志","王双响","陈思诺","陈雨涵","周亚楠","张力婧","林可馨","吴梓嘉","吴梓嘉"];
            $("textarea[id='element']").eq(0).val(bangyang[Math.floor(Math.random()*22) + 0]);
                 $("textarea[id='element']").eq(1).val('努力学习超过他');
                 $("textarea[id='element']").eq(2).val('加油');
        });



    }
}

(function() {
    'use strict';
    // 注入css样式调整页面
    addStyle();

    // 检测页面变化, 无刷新重新执行脚本
    document.addEventListener('DOMNodeInserted', function() {
        // 添加自动投票按钮
        addAutoVoteBtn();

        // 切换分页数据最大
        $("li.ivu-select-item").wait(clickPage);

        // 隐藏=教师填报记录  和  未开始
        hide_ul_li();

        // 自动填写评价
        autoWrite();

        // 关闭5秒倒计时弹窗
        $("button.opacity.btn-sel").click();

        // 自动选择选项
        // autoChoose();

        // 添加自动成长记录按钮
        addAutoGrowUpBtns();

        // console.log(      $("a:contains(保存)").eq(0)        )
    }, false);


    $(function(){
        console.log("页面加载完成！");
    })


})();