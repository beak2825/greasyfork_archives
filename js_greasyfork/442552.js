// ==UserScript==
// @name        OnlineMathContestProblems 0.3
// @namespace    https://twitter.com/kstation_kagigi
// @version      2.2
// @description  OMC problem's expansion function
// @author       stranger_86952
// @match        https://onlinemathcontest.com/problems
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442552/OnlineMathContestProblems%2003.user.js
// @updateURL https://update.greasyfork.org/scripts/442552/OnlineMathContestProblems%2003.meta.js
// ==/UserScript==

/*
localStorage:
0 -> not CA
1 -> CA
2 -> 404
*/

/*
execute_count(i,num,cell)
execute_old(ath,cell,num)
execute_new(ath,cell,num,otu)
execute_all()
execute_start()
*/

$('body').append('<div id="announce-from-k">?</div>');
$('#announce-from-k').css('position','fixed');
$('#announce-from-k').css('bottom','0');
$('#announce-from-k').css('right','0');
$('#announce-from-k').css('margin','10px');
$('#announce-from-k').css('font-size','24px');

$('body').append('<ul id="announce-from-k2">作成者からのお知らせ<li>現在のバージョンは2.2です</li><li>ver.1.xでvolunteerタグのコンテストを読み込んだ方はOMC中本杯(P)を読み込めないバグがあります</li><li>対処法として、volunteerタグにあるコンテストデータを一度すべて削除してから読み込み直すことで正常に動作します。</li><li>現状致命的なバグは見つかっていませんが、意見やバグ報告はDiscord,TwitterのDMから連絡してください。</li></ul>');
$('#announce-from-k2').css('position','fixed');
$('#announce-from-k2').css('bottom','50px');
$('#announce-from-k2').css('right','0');
$('#announce-from-k2').css('width','70%');
$('#announce-from-k2').css('margin','10px');
$('#announce-from-k2').css('font-size','16px');
$('#announce-from-k2').css('background-color','rgba(255,255,255,0.8)');

$('#problems-table').find('form').after('<div class="custom-from-k" style="margin:12px"></div>');
$('.custom-from-k').append('<p><label><input type="checkbox" id="get_ca">新規CAを取得しますか？</label></p>');
$('.custom-from-k').append('<p><div class="get_ca_now">wait...</div></p>');
$('.custom-from-k').append('<button id="remove_ca">削除</button>');

let contest_type = $('.col-sm-12').find('span');
let load_num = 0;
let status = $('.get_ca_now');
let problem_top;
let problem_top_color;
let problem_counter = new Array();

function execute_color_reset(){
    $(status).text('色リセット');
    $('thead').find('tr').each(function(index, contestInfo) {
        var ths = $(contestInfo).find('th');
        for(var i=0;i<ths.length;i++){
          $(ths[i]).css('background-color','#FFFFFF');
        }
    });
    $('tbody').find('tr').each(function(index, contestInfo) {
        $(contestInfo).find('th').css('background-color','#FFFFFF');
        var tds = $(contestInfo).find('td');
        for(var i=0;i<tds.length;i++){
          $(tds[i]).css('background-color','#FFFFFF');
        }
    });
}

function execute_count(i,num,cell,usolo){
    if(usolo == null){
        //
    }
    else if(usolo[i]=='1'){
        $(cell[i]).css('background-color','#cde9ce');
        problem_counter[0]++,problem_counter[1]++,problem_counter[i*2+2]++,problem_counter[i*2+3]++;
    }
    else if(usolo[i]=='0'){
        $(cell[i]).css('background-color','#FFFFFF');
        problem_counter[1]++,problem_counter[i*2+3]++;
    }
    else $(cell[i]).css('background-color','#FFFFFF');
    for(var j=0;j<$('thead').find('tr').find('th').length;j++){
        if(problem_counter[j*2]==problem_counter[j*2+1] && problem_counter[j*2]>0) $(problem_top_color[j]).css('background-color','#cde9ce');
        else $(problem_top_color[j]).css('background-color','#FFFFFF');
    }
    $(problem_top[0]).text(' - ' + String(problem_counter[0]) + '/' + String(problem_counter[1]));
    $(problem_top[i+1]).text(' - ' + String(problem_counter[i*2+2]) + '/' + String(problem_counter[i*2+3]));
}

function execute_old(ath,cell,num){
    console.log('old!');
    usolo = localStorage.getItem($(ath).find('a').text());
    if(usolo == null){
        $(status).text('読み込まれていないコンテストがあります。正常に動作しません。');
    }
    else if(usolo.indexOf('0')!=-1){
        $(ath).css('background-color','#FFFFFF');
        for(var i=0;i<num;i++){
            if(usolo[i]=='0' && $(cell[i]).find('a').text()==''){
                var s0 = usolo.length;
                var s1 = usolo.slice(0,i);
                var s2 = usolo.slice(i+1,s0);
                var s3 = ks1 + '2' + s2;
                localStorage.setItem($(ath).find('a').text(),s3);
                usolo = localStorage.getItem($(ath).find('a').text());
            }
        }
    }
    else $(ath).css('background-color','#cde9ce');
    usolo = localStorage.getItem($(ath).find('a').text());
    for(var i2=0;i2<num;i2++){
        execute_count(i2,num,cell,usolo);
    }
}

function execute_new(ath,cell,num,otu){
    var s = $(ath).find('a').attr('href');
    s = String(s);
    var u = "https://onlinemathcontest.com" + s + "/tasks";
    if(localStorage[$(ath).find('a').text()] == null){
        var sample = "";
        for(var i=0;i<num;i++) sample=sample+'0';
        localStorage.setItem($(ath).find('a').text(),sample);
    }
    var usolo = localStorage.getItem($(ath).find('a').text());
    console.log($(ath).find('a').text()+' '+usolo);
    if(usolo.indexOf('0') != -1){
        $(ath).css('background-color','#FFFFFF');
        $.ajax({
            url: u,
            type: 'GET',
            dataType: 'html',
        })
        .done(function(data) {
            $(data).find('challenge-container').find('table').find('tbody').each(function(){
                var gettds = $(this).find('tr');
                for(var i=0;i<num;i++){
                    if(usolo[i]=='0'){
                        var bc = $(gettds[i]).attr('class');
                        if(bc == 'table-success'){
                            var s0 = usolo.length;
                            var s1 = usolo.slice(0,i);
                            var s2 = usolo.slice(i+1,s0);
                            var s3 = s1 + '1' + s2;
                            localStorage.setItem($(ath).find('a').text(),s3);
                            usolo = localStorage.getItem($(ath).find('a').text());
                            execute_count(i,num,cell,usolo);
                        }
                        else{
                            if($(cell[i]).find('a').text() == ''){
                                var s02 = usolo.length;
                                var s12 = usolo.slice(0,i);
                                var s22 = usolo.slice(i+1,s02);
                                var s32 = s12 + '2' + s22;
                                localStorage.setItem($(ath).find('a').text(),s32);
                                usolo = localStorage.getItem($(ath).find('a').text());
                            }
                        }
                    }
                    load_num++;
                    $(status).text(String(load_num) + "/" + String(otu*num));
                    if(load_num==otu*num) $(status).text('読み込み完了');
                }
                console.log('2' + $(ath).find('a').text()+' '+usolo);
                if(usolo.indexOf('0') == -1) $(ath).css('background-color','#cde9ce');
            });
        })
        .fail(function( data ) {
            //
        });
    }
    else{
        $(ath).css('background-color','#cde9ce');
        load_num=load_num+num;
        $(status).text(String(load_num) + "/" + String(otu*num));
        if(load_num==otu*num){
            $(status).text('読み込み完了');
        }
    }
    usolo = localStorage.getItem($(ath).find('a').text());
    for(var j=0;j<num;j++){
        execute_count(j,num,cell,usolo);
    }
}

function execute_all(){
    var num=$('thead').find('tr').find('th').length-1;
    $(status).text('---');
    for(var i=0;i<num+1;i++) $(problem_top_color[i]).css('background-color','#FFFFFF');
    if($('#get_ca').prop('checked')==false){
        $(status).text('新規CAを取得しません');
        $('tbody').find('tr').each(function(index, contestInfo) {
            var ath = $(contestInfo).find('th');
            var tds = $(contestInfo).find('td');
            execute_old(ath,tds,num);
        });
    }
    else{
        load_num=0;
        $(status).text('CA読み込み開始');
        $('tbody').find('tr').each(function(index, contestInfo) {
            var tr = $('tbody').find('tr');
            var ath = $(contestInfo).find('th');
            var tds = $(contestInfo).find('td');
            execute_new(ath,tds,num,tr.length);
        });
    }
}

function execute_start(){
  execute_color_reset();
    setTimeout(function(){
        $('thead').find('tr').find('th').find('span').remove();
        $('thead').find('tr').find('th').append('<span>---</span>');
        problem_top = $('thead').find('tr').find('th').find('span');
        problem_top_color = $('thead').find('tr').find('th');
        problem_counter=[];
        problem_counter=Array(($('thead').find('tr').find('th').length)*2);
        problem_counter.fill(0);
        var s='';
        $('tbody').find('tr').each(function(index, contestInfo) {
            s = s + '<option>' + String($(contestInfo).find('th').text()) + '</option>';
        });
        $('.custom-from-k').find('.remove').remove();
        $('.custom-from-k').append('<select size="1" name="remove_select" class="remove"><option>削除するコンテストデータを選択してください</option>' + s + '</select>');
        execute_all();
    },500);
}

window.onload = function(){
    $('thead').find('tr').find('th').append('<span>test</span>');
    execute_start();
    $('#announce-from-k2').hide();
}
$(contest_type).on('click', function() {
    execute_start();
});
$('#remove_ca').click(function() {
    if(String($('[name=remove_select] option:selected').text())=='削除するコンテストデータを選択してください'){
        alert('削除するコンテストデータを選択してください');
    }
    else if(localStorage.getItem(String($('[name=remove_select] option:selected').text()))==null){
        alert('データがありません');
    }
    else{
        localStorage.removeItem(String($('[name=remove_select] option:selected').text()));
        alert(String($('[name=remove_select] option:selected').text()) + 'を削除しました');
    }
});
$('#announce-from-k').hover(
    function(){
        $('#announce-from-k2').show();
    },
    function(){
        $('#announce-from-k2').hide();
    }
);

/*
if your data is worng, please enter 'localStorage.clear();' in console.
but it means clear all data about this script.
so, I think it is the best way to change your localstorage data immediate.
*/
