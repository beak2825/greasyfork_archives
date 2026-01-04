// ==UserScript==
// @name         优课联盟|uooc小助手
// @namespace    http://tampermonkey.net/
// @version      1.1.5
// @description  优课联盟看视频，答题；题库非自有，用的超星coder_tq。
// @author       YR|亚日
// @match        http://www.uooc.net.cn/*
// @match        http://www.uooconline.com/*
// @icon         https://www.google.com/s2/favicons?domain=uooc.net.cn
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant         GM_getValue
// @connect        *
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/424536/%E4%BC%98%E8%AF%BE%E8%81%94%E7%9B%9F%7Cuooc%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/424536/%E4%BC%98%E8%AF%BE%E8%81%94%E7%9B%9F%7Cuooc%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

//初始化函数
function init(){
    if(GM_getValue('ininm',1)){
    GM_setValue('ininm',0);
    GM_setValue('mute',1);
    GM_setValue('speed',2)}
}
var dha=$("<form id='dha1' style=‘font-size: 9pt; color: #FF0000’ size=‘8’ name='dah3'><p>静音：是<input type='radio' title='vol' name='vo' value='1'>否<input type='radio' nametitle='vol' name='vo' value='0'></p>速率：1X<input type='radio' name='speed' value='1'> 1.5X <input type='radio' name='speed' value='1.5'>2X<input type='radio'  name='speed' value='2'><button id='keep' type=‘button’>&nbsp&nbsp保存</button><button id='hide' type=‘button’>&nbsp&nbsp隐藏</button>")
function opp() {$(".fl_left ").parent().append("<p id='dha2' style='background:grey'></p>");
    $(".goback  ").prepend("<button id='key' >uook</button>");
    $("#key").hover(
        function () {
            $(this).prepend(kkk);
             $("#set").hover(
        function () {
            $("#dha2 ").prepend(dha);
            $("input[name='vo']").val([GM_getValue('mute')]);$("input[name='speed']").val([GM_getValue('speed')]);
            $("#keep").on("click", function(){event.preventDefault();let mute=$("input[name='vo']:checked").val(); let speed=$("input[name='speed']:checked").val();

 GM_setValue('mute',mute);
    GM_setValue('speed',speed);
window.location.reload()
            })
            $("#hide").on("click",function(){$("#dha1").remove();})

        },
        function () {

        }
    );
        },
        function () {
            $("#value").remove();
 
        }
    );
    var kkk = $(
        "<div id='value'><p>欢迎使用，菜鸟之作</p><a href='https://z3.ax1x.com/2021/04/05/cQcmZj.jpg'>鼓励   </a><a href='' id='set'>设置</a><p>提示：请等待5s、如遇卡顿请刷新</p><p>警告：有风险，切题库正确率无法保证</div>"
    )
}
//获取当前状态
function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}
var xxx = 0;
var sss = 0;
var arrEntities = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"','#39':"'" };
function sum() {
    function get(scope) {
        var i;
        var list;
        list = scope;
        for (i = 0; i < list.length; i++) {
            if (list[i].finished == 0) {
                break;
            }
        }
        return list[i]
    }
    //展开目录
    function open(scopel) {
        if (!scopel.hide) {} else {
            $("#" + scopel.id + ">div").click();

        }
    }
    var appElement = $(".rank-1").get(0);
    var $scope1 = angular.element(appElement).scope();
    var key = get($scope1.chapterList);
    open(key);
    var key1 = get(key.children);
    open(key1);
    function find11(key){open(key)}
    function find22(){if(key.hide){find11(key)}else{find11(key1)}}
    function find33 (){setTimeout(function(){if(key.hide||key1.hide){;find22()}else{setTimeout( function (){find33()},500)}},100)}
    find33();
    setTimeout(function(){xunzao(key1)},500)

}
//打开视频
function video(ttt) {
    var done = false
    $(".tag-source-name:contains('视频')").eq(ttt).parent().click();
    qt();
    let video = document.querySelector('#player_html5_api');
    video.playbackRate = GM_getValue('speed');
    if( GM_getValue('mute')){video.muted = true}else{video.muted = false};
    video.play();

    function detect() {
        let quizLayer = document.querySelector('#quizLayer');
        if (quizLayer && quizLayer.style.display != 'none') {

            let source = JSON.parse(document.querySelector('div[uooc-video]').getAttribute('source'));
            let quizList = source.quiz;
            let quizIndex = 0;
            let quizQuestion = $('.smallTest-view .ti-q-c').html();
            for (let i = 0; i < quizList.length; i++) {console.log(quizList[i].question.replace(/&(lt|gt|nbsp|amp|quot);/ig,function(all,t){ return arrEntities[t];}))
                if (quizList[i].question.replace(/&(lt|gt|nbsp|amp|quot|#39);/ig,function(all,t){ return arrEntities[t];}) == quizQuestion) {
                    quizIndex = i;
                    break;
                };
            };
            let quizAnswer = eval(quizList[quizIndex].answer);console.log(quizAnswer)
            let quizOptions = quizLayer.querySelector('div.ti-alist');
            for (let ans of quizAnswer) {
                let labelIndex = ans.charCodeAt() - 'A'.charCodeAt();
                quizOptions.children[labelIndex].click();
            }; 
            setTimeout(function (){quizLayer.querySelector('button').click()},100);

        }; 
        if (video.ended) {
            done = true;
           setTimeout(link(),2000);
        }
        if (!done) {
            setTimeout(detect, 5000);
            if (video.paused) {
                video.play();
            } else {
                document.querySelectorAll('.layui-layer-shade, #quizLayer').forEach(e => e.style.display = 'none');
            };
        };
    }; 

    detect();
}
//打开作业
function task() {
    var aaa = 0;
    var lement = $("iframe").contents().find(".ti-q-c");
    findanswer(lement[aaa]);

    function findanswer($ment) {
        var question = $($ment).text().replace(/^【.*?】\s*/, '').replace(/\s*（\d+\.\d+分）$/, '').replace(/[(]\s*[)]。$/,
            '').replace(/（\s*）。$/, '').replace(/[(]\s*[)]$/, '').replace(/（\s*）$/, '').replace(/。$/, '');


        GM_xmlhttpRequest({
            method: 'POST',
            url: 'http://cx.icodef.com/wyn-nb',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded',
                'Authorization': {},
            },
            data: 'question=' + encodeURIComponent(question) + '&type=' + 0,
            timeout: 5000,
            onload: function (xhr) {
                if (xhr.status == 200) {
                    var obj = $.parseJSON(xhr.responseText) || {};
                    obj.answer = obj.data;
                    var qqq = $("iframe").contents().find(".ti-alist");
                    fillAnswer(qqq[aaa], obj);
                    aaa++;
                    sleep(500).then(() => {
                        findanswer(lement[aaa]);
                    })

                }
            }

        })
    }

    function filterImg(dom) {
        return $(dom).clone().find('img[src]').replaceWith(function () {
            return $('<p></p>').text('<img src="' + $(this).attr('src') + '">');
        }).end().find('iframe[src]').replaceWith(function () {
            return $('<p></p>').text('<iframe src="' + $(this).attr('src') + '"></irame>');
        }).end().text().trim();
    }

    function fillAnswer(li, obj) {
        var $li = $(li);
        var $input = $li.find(':radio, :checkbox'),
            str = String(obj.answer).toCDB() || new Date().toString(),
            data = str.split(/#|\x01|\|/),
            opt = obj.opt || str;
        $input.each(function (index) {
            if (this.value == 'A') {
                data.join().match(/(^|,)(正确|是|对|√|T|ri)(,|$)/) && this.click();
            } else if (this.value == 'B') {
                data.join().match(/(^|,)(错误|否|错|×|F|wr)(,|$)/) && this.click();
            } ;

                var tip = $li.find(".ti-a-c").eq(index).text().toCDB() || new Date().toString();
                Boolean($.inArray(tip, data) + 1 || (str.indexOf(tip) + 1)) == this.checked || this.click();

        }).each(function () {
            if (!/^A?B?C?D?E?F?G?$/.test(opt)) return false;
            Boolean(opt.match(this.value)) == this.checked || this.click();
        });

    }
    String.prototype.toCDB = function () {
        return this.replace(/\s/g, '').replace(/[\uff01-\uff5e]/g, function (str) {
            return String.fromCharCode(str.charCodeAt(0) - 65248);
        }).replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/。/g, '.');
    };
}
//打开讨论
function discuss() {}

function qt() {
    $(".vjs-tech").off("mousemove", "**");
    $("html").off("mouseout", "**");
}

//链接函数
function link() {
 sum();
}

function wait() {
    if ((document.readyState == 'complete')&&($(".learn-main-right").is("div"))){
        var s = window.location.href;
        var patt = /home\/learn\/index/i;
        var m = patt.test(s);
        if (m) {init();
            opp();
            link();
        }
    } else {
        setTimeout(wait, 500);
    }
};
function xunzao(key1){if(!key1.hide){if(key1.unitSource!=undefined){for (var mmm = 0; mmm < key1.unitSource.length; mmm++) {
        if (key1.unitSource[mmm].finished == 0 && key1.unitSource[mmm].content == null) {
            sss = mmm;
            break;
        } else if (key1.unitSource[mmm].content != null) {
            xxx++
        }

    }}
        if($(".tag-source-name:contains('视频')")){
        setTimeout( function(){video(sss-xxx);},100);}
        if ($(".tag-source-name:contains('测验')")) {
     if ($(".tag-source-name:contains('测验')")) {
        $(".tag-source-name:contains('测验')").parent().click();
    }
                setTimeout(task, 5000);
            }}else {setTimeout( function (){xunzao(key1)},500)}}
wait();