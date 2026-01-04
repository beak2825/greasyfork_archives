// ==UserScript==
// @name         caicicaici
// @namespace    http://tampermonkey.net/
// @version      0.92
// @description  caici
// @author       ppppp tttt
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.js
// @require      https://cdn.staticfile.org/html2canvas/0.5.0-beta4/html2canvas.js
// @match        https://mp.weixin.qq.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395194/caicicaici.user.js
// @updateURL https://update.greasyfork.org/scripts/395194/caicicaici.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var caici = `
<div id="caici">
    <div id="list_cycle"></div>
    <ul id="list">
    </ul>
    <div class='cg1' data-index='0'>111</div>
    <div id="an" >
     <div class='cg2'>222</div>
     <div class='cg3'>333</div>
     <div class='cg4'>444</div>
      <div class='id' style="display:none;">-1</div>
    </div>

    <div class="bottom">
    <div class="cai"><span>r</span><span>r</span><span>r</span><span>r</span></div>



    <div class='hide_btn' onclick='hide()'>隐</div>
    <div class='show_btn' onclick=''>显示</div>
    <div class='pre_btn' onclick='next(true)'>上</div>
    <div class='show_caici'>答</div>
    </div>
</div>
<div id="previewImage"></div><a href="#" id="down_img">下载</a>
`;

    var mini_cycle = `<b id="mini_cycle"></b>`;

var css = `
<style>
#mini_cycle, #list_cycle {
    position: fixed;
    right: 10px;
    top: 10px;
    display: block;
    width: 20px;
    height: 20px;
    background: #f3d1d170;
    font-size: 10px;
    font-weight: 100;
    border-radius: 10px;
    border: 1px solid #ffd8c5;
    text-align: center;
    line-height: 20px;
    z-index:2;
}
#list_cycle{
left:10px;
}
#list{
display:none;
padding-top:33px;
}

#caici {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    background: white;
    width: 100vw;
    height: 120vh;
    z-index: 1;
}
.hide{display:none;}
.cg1,.cg2,.cg3,.cg4{
    font-size:22px;
    width:95vw;
    text-align:center;
    border: 1px solid #b5aeae;
    min-height: max-content;
    overflow: hidden;
    position: relative;
    display:grid;
}
#an{
}
.bottom{
    display:block;
    position:fixed;
    bottom:5px;
}
.cai{
text-align: center;
}
.cai .space{
    width: 15px;
    height: 27px;
    display: inline-block;
    margin-bottom: -10px;
}
.black_back{
background:black;
}

.num{

    list-style: none;
    width: 98vw;
    padding: 0;
    margin:0;
}
.num li{
    display: block;
    float: left;
    width: 5.3vw;
    text-align: center;
    height: 33px;
    line-height: 33px;
    background: darkgrey;
    border-right: white 1px solid;
}
.num .select_no{}
.num .select_yes{background: #0a8c7f;}
.num .all{
    background: #2196F3;
    width: 10vw;
    border-right: none;
}

.hide_btn, .show_btn ,.pre_btn,.show_caici{
    width: 30vw;
    height: 40px;
    text-align: center;
    background: #105413;
    line-height: 40px;
    font-size: 22px;
    color: #fff;
    float: left;
    margin-left: 1px;
    margin-top: 5px;
}
.hide_btn{background: #b4b4b4;width:10vw}
.pre_btn{background: #b4b4b4;width:10vw}
.show_btn{width:60vw}
.show_caici{width:10vw;}

#caici_table{
color:#000000;
}
#caici_table td{white-space: nowrap; }
</style>
`;

    if(! $('#mini_cycle').length){
        $('body').append(css).append(mini_cycle).append(caici);
    }


    $('#mini_cycle').off('click').click(function(){
        $('#caici').toggle();
    });

    var imgs = [];
$('.rich_pages').each(function(i,v){
    var src = $(this).data('src');
    imgs.push(src);
//     console.log(src);
});

var title = $('.rich_media_title').text().trim();
if('undefined' != typeof(title)){
    var is_caici = title.indexOf('拆词') > 0;
    var date = title.substring(1,9);
//     console.log(is_caici);
}

var words = [];
$('td').each(function(i,v){
    var text = $(this).text();
    if(typeof text !== 'undefined'){
        var t = text.split('.').pop().trim();
        words.push(t);
    }
});

var item1 = {};
item1.title = title;
item1.date = date;
item1.words = words;
item1.imgs = imgs;

// var cg = {};
// cg['cg'+date] = item1;

var tmp = window.localStorage.__cg;
var obj1 = {};
if(typeof tmp !== 'undefined'){
    obj1 = JSON.parse(tmp);
}
// if( typeof(obj['cg'+date]) === 'undefined'){
    obj1['cg'+date] = item1;
    window.localStorage.__cg = JSON.stringify(obj1);
  //  console.log(obj1);
// }


    var caici_1 = {};
    var caici_2 = {};



    var item_obj = item1;
    var all_words = words;
    var img1_w = 0;
    var img1_h = 0;
    var img2_w = 0;
    var img2_h = 0;

    var cg = window.localStorage.__cg;
    var obj = {};
    if('undefined' !== typeof cg){
        obj = JSON.parse(cg);
        var str = '';
        for(var i in obj){
            if(obj[i].date != ''){
                str += '<li class="'+i+'">'+obj[i].date+'</li>';
            }
        }

        $('#list').html(str);
        //     console.log(obj);
    }
    $('#list').on('click','li',function(){
        $(this).attr('class');
        item_obj = obj[i];
        all_words = item_obj.words;
    });
    // function update(i){
    //     item_obj = obj[i];
    //     all_words = item_obj.words;
    // }

    $('#list_cycle').click(function(){
        $('#list').toggle();
    });

    window.element = $("#caici_jieguo"); // global variable
    window.getCanvas; // global variable



    $('.show_caici').click(function(){

        if($('#caici_jieguo').length==0){
            $('#meta_content').after('<div id="caici_jieguo" style="background:#ffffff;"></div>');
        }

        var html = $('.rich_media_title').text().trim() + "<table id='caici_table'>";

        for(var i in all_words){
            var str1 = typeof(caici_1[i]) == 'undefined' ? '' : caici_1[i];
            var str2 = typeof(caici_2[i]) == 'undefined' ? '' : caici_2[i];
            if(str1 == str2){
               str2 = '';
            }
html += '<tr><td>'+i+'. ' + all_words[i]+'</td><td>'+str1+'</td><td>'+str2+'</td></tr>';
        }

        html += '</table>';

        $('#caici_jieguo').html(html);

        html2canvas($('#caici_jieguo'), {
         onrendered: function (canvas) {
                $("#previewImage").append(canvas);
             var imgageData = canvas.toDataURL("image/png");
    var newData = imgageData.replace(/^data:image\/png/, "data:application/octet-stream");
    $("#down_img").attr("download", $('.rich_media_title').text().trim()+".png").attr("href", newData);
             }
         });

    });


    $('.show_btn,.pre_btn').off('click').click(function(){
        var i = $('.id').text();
        var an = $('#an').hasClass('hide');
        var pre = $(this).hasClass('pre_btn');


        if(an){
            caici_1[i] = $('.cai').text();
            $('#an').removeClass('hide');
        }else{
            caici_2[i] = $('.cai').text();
            if(pre){
                i--;
                if(i<0){
                    i=all_words.length;
                }
            }else{
                i++;
                if(i>=all_words.length){
                    i=0;
                }
            }

            $('.id').text(i);
            var item = all_words[i];
            var img1 = item_obj.imgs[0];
            var img2 = item_obj.imgs[1];
            $('#an').addClass('hide');
            $('.cg1').html(item);
            $('.cg2').html('<img class="an_img1" src = "" style="width: 100%;">');
            $('.cg3').html('<img class="an_img2" src = "'+img2+'" style="width: 100%;position: relative;">');
            $('.cg4').html('');
            addToCai(item);

            $('.an_img1').one('load',function(){
                var i = Number($('.id').text());
                img1_w = $('.an_img1')[0].naturalWidth;
                img1_h = $('.an_img1')[0].naturalHeight;
                var div_w = $('.cg1').width();
                var img1_nw = img1_w * (div_w / img1_w);
                var img1_nh = img1_h * (div_w / img1_w);
                $('.cg2').height(Math.floor(img1_nh/51));
                var t = Math.floor(img1_nh/51*(1+i));
                $('.an_img1').attr('style','width:100%;position: relative;top: -'+t+'px');
                //$('.an_img1').attr('style="width:100%,top, -'+t+'"');
                console.log('img1_w:'+img1_w + 'img1_h:'+img1_h);
            }).attr('src', img1);

            $('.an_img2').one('load',function(){
                var i = Number($('.id').text());
                img2_w = $('.an_img2')[0].naturalWidth;
                img2_h = $('.an_img2')[0].naturalHeight;
                var div_w = $('.cg1').width();
                var img2_nw = img2_w * (div_w / img2_w);
                var img2_nh = img1_h * (div_w / img2_w);
                $('.cg3').height(Math.floor(img2_nh/51));
                var t = Math.floor(img2_nh/51*(1+i));
                $('.an_img2').attr('style','width:100%;position: relative;top: -'+t+'px');
                //$('.an_img1').attr('style="width:100%,top, -'+t+'"');
                console.log('img1_w:'+img1_w + 'img1_h:'+img1_h);
            }).attr('src', img2);

            //         $('.an_img2').one('load',function(){
            //             img2_w = $('.an_img2')[0].naturalWidth;
            //             img2_h = $('.an_img2')[0].naturalHeight;
            //             var div_w = $('.cg1').width();
            //             img2_w = img2_w * (div_w / img2_w);
            //             img2_h = img2_h * (div_w / img2_w);
            //             $('.an_img2').height(img2_h/51*(i+2));
            //             console.log('img1_w:'+img2_w + 'img1_h:'+img2_h);
            //         }).attr('src', img2);

            //         $('.cg2').html(item.cg2);
            //         $('.cg3').html(item.cg3);
            //         $('.cg4').html(item.cg4);
            $('.id').html(i);
        }
    });

    $('.cai').on('click', '.space', function(){
        if($(this).hasClass('black_back')){
            $(this).text('').removeClass('black_back');
        }else{
            $(this).text(' ').addClass('black_back');
        }
    });

    function addToCai(str){
        var arr = str.split('');
        var tmp_str = arr.join('<span class="space"></span>');
        $('.cai').html(tmp_str);
    }
/*
    function next(pre){
        var i = $('.id').text();
        var an = $('#an').hasClass('hide');

        if(an){
            $('#an').removeClass('hide');
        }else{
            if(pre){
                i--;
                if(i<0){
                    i=all_words.length;
                }
            }else{
                i++;
                if(i>=all_words.length){
                    i=0;
                }
            }

            $('.id').text(i);
            var item = all_words[i];
            var img1 = item_obj.imgs[0];
            var img2 = item_obj.imgs[1];
            $('#an').addClass('hide');
            $('.cg1').html(item);
            $('.cg2').html('<img class="an_img" src = "'+img1+'" style="">');
            $('.cg3').html('<img class="an_img" src = "'+img2+'" style="">');

            //         $('.cg2').html(item.cg2);
            //         $('.cg3').html(item.cg3);
            //         $('.cg4').html(item.cg4);
            $('.id').html(item.i);
        }
    }
*/

    //获取随机数数组  startcount为起始值 ,maxcount为最大值
    function randomArr(startcount, maxcount) {
        var arr = [];
        for (var i = startcount; i < maxcount; i++) {
            arr.push(i);
        }
        return arr;
    }

    //取出随机数  arr为数组，maxNum为取出随机数的个数
    function RandomNumBoth(arr, maxNum) {
        var numArr = [];
        var arrLength = arr.length;
        for (var i = 0; i < arrLength; i++) {
            var Rand = arr.length;
            //取出随机数
            var number = Math.floor(Math.random() * arr.length); //生成随机数num
            numArr.push(arr[number]); //往新建的数组里面传入数值
            arr.splice(number, 1); //传入一个删除一个，避免重复
            if (arr.length <= arrLength - maxNum) {
                return numArr;
            }
        }
    }

    var arr = randomArr(0, all_words.length);
    arr = RandomNumBoth(arr, all_words.length);

})();