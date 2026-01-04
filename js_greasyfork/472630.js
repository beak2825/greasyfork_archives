// ==UserScript==
// @name         tapd-extensions
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  extensions
// @author       You
// @match        https://www.tapd.cn/*/board/index*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tapd.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/472630/tapd-extensions.user.js
// @updateURL https://update.greasyfork.org/scripts/472630/tapd-extensions.meta.js
// ==/UserScript==

(function() {
    var checkLoad = setInterval(function(){
        if($('ul.board-view li').length > 0){
            clearInterval(checkLoad);
            $('ul.board-view li').each(function(index,item){
                var listBottom = $(this).find('.list-bottom');
                var addCardWrap = $(this).find('.add-card-wrap');
                var listBottomHtml = listBottom.prop("outerHTML");
                var addCardWrapHtml = addCardWrap.prop("outerHTML");
                var newAddCardWrapHtml = '<div class="cards-wrap webkit-scrollbar">'+addCardWrapHtml+'</div>';
                var extensionsHtml = '<div class="cards-wrap"><div class="button-wrapper" style="margin-left:60px">'+
                    '<button class="btn btn-primary btn-ok" onclick="autoOrder('+index+')">自动排序</button>'+
                    '<button class="btn btn-primary btn-ok" onclick="autoDelay('+index+')">自动延期</button>'+
                    '</div></div>';
                listBottom.remove();
                addCardWrap.remove();
                $(this).find('.list-header').after(listBottomHtml+newAddCardWrapHtml+extensionsHtml);
            });
            $('.add-board').after('<div style="display:inline-block;margin-left:20px">'+
                                  '<button class="btn btn-primary btn-ok dailyReport1" onclick="addCheckboxForDailyReport()">生成日报</button>'+
                                  '<button class="btn btn-primary btn-ok dailyReport2" style="display:none" onclick="dailyReport()">确认生成</button>'+
                                  '<button class="btn dailyReport2 beforeTextarea" style="display:none" onclick="dailyReportCancel()">取消</button>'+
                                  '<textarea id="dailyReportTextarea" style="display:none;font-size:16px"></textarea>'+
                                  '<div>'
                                 )
            .after('<div style="display:inline-block;margin-left:20px">'+
                                  '<button class="btn btn-primary btn-ok beforeTable" onclick="exportTable()">建材板块表格</button>'+
                                  '<div id="exportTable" style="display:none;font-size:16px;height:600px;overflow:scroll"><table></table><div>'+
                                  '<div>'
                                 )
        }
    },1000);
    // Your code here...
})();

window.autoOrder = function(index){
    var li = $($('ul.board-view li')[index]);
    var boardId = $('#board').attr('board-id');
    var listId = li.attr('list-id');
    var cards = li.find('ul li');
    var dates = [];
    var cardIds = [];
    var D = getYesterdayTodayAndTomorrow();
    cards.each(function(index,item){
        var date = $(this).find('.date').html();
        if(!date){ return true }
        if(isContains(date,'截止')){
            date = date.replace(' 截止','');
        }
        if(isContains(date,'昨天')){
            date = D.yesterday;
        }
        if(isContains(date,'今天')){
            date = D.today;
        }
        if(isContains(date,'明天')){
            date = D.tomorrow;
        }
        dates[index] = [];
        dates[index][0] = date.trim();
        dates[index][1] = $(this).attr('card-id');
    });
    var datesTemp = [];
    $.each(dates,function(index,item){
         if(item){datesTemp.push(item)}
    });
    dates = datesTemp;
    var params = [];
    var sortedDates = mergeSort(dates);
    $.each(sortedDates,function(index,sortedItem){
        var cardId = sortedItem[1];
        var preCardId = index===0?0:sortedDates[index-1][1];
        params.push({
            thisId:cardId,
            preCardId:preCardId,
            listId:listId,
            boardId:boardId,
        })
    });
    $.each(params,function(index,item){
        var cardId = item.thisId;
        var preCardId = item.preCardId;
        if(preCardId == 0){
            item.isOrdered = dates[0][1] === cardId
            return true;
        }
        $.each(dates,function(index,datesItem){
            if(datesItem[1] === cardId){
                item.isOrdered = false;
                return false;
            }
            if(datesItem[1] === preCardId){
                item.isOrdered = true;
                return false;
            }
        });
    });
    var href = window.location.href;
    var baseUrl = href.substring(0,href.indexOf('board/'));
    var reqParms = [];
    $.each(params,function(index,item){
        if(!item.isOrdered){
            reqParms.push(item);
        }
    });
    $.each(params,function(index,item){
        var fd = new FormData();
        for(var key in item){
            if(key === 'isOrdered'){continue}
           fd.append(key,item[key]);
        }
        $.ajax({
            async: false,
            cache: false,
            processData: false,
            contentType: false,
            type: 'post',
            url: baseUrl+ 'board/card/sort_card?time='+new Date().getTime(),
            data: fd,
            success:function(res){
               if(index === params.length -1){
                   window.location.reload();
               }
            }
        })
    });
}
window.autoDelay = function(index){
    var li = $($('ul.board-view li')[index]);
    var cards = li.find('ul li');
    var cardIds = [];
    cards.each(function(index,item){
        var onwer = $(this).attr('data-owners');
        var date = $(this).find('.date').html();
        if((isContains(onwer,'张书伟') || isContains(onwer,'章晓婷') || isContains(onwer,'林生凯'))
          && (isContains(date,'昨天') || isContains(date,'今天'))
          && !$(this).find('.finish-card-btn').prop('checked')){
            cardIds.push($(this).attr('card-id'));
        }
    });
    var href = window.location.href;
    var baseUrl = href.substring(0,href.indexOf('board/'));
    var dates = getYesterdayTodayAndTomorrow();
    $.each(cardIds,function(index,item){
        var fd = new FormData();
        fd.append('cardId',item);
        fd.append('field','due');
        fd.append('value',formatDate1(dates.tomorrowDate));
        $.ajax({
            async: false,
            cache: false,
            processData: false,
            contentType: false,
            type: 'post',
            url: baseUrl+ 'board/card/edit_card?need_sorted_owner=true&view_type=board&time='+new Date().getTime(),
            data: fd,
            success:function(res){
                if(index === cardIds.length -1){
                    window.location.reload();
                }
            }
        })
    });
}
window.addCheckboxForDailyReport = function(){
    var li = $('ul.board-view>li');
    var cards = li.find('ul li');
    cards.each(function(index,item){
        var onwer = $(this).attr('data-owners');
        var date = $(this).find('.date').html();
        if((isContains(onwer,'张书伟') || isContains(onwer,'章晓婷') || isContains(onwer,'林生凯'))
          /*&& !$(this).find('.finish-card-btn').prop('checked')*/){
            $(this).find('.pull-left-time').after('<div class="pull-left dailyReportCheckbox" style="margin-right:10px"><input type="checkbox" value="1"> 今日</input>  <input type="checkbox" value="2"> 明日</input></div>');
        }
    });
    $(".dailyReportCheckbox input").click( function(e){
        e.stopPropagation();
    });
    $('.dailyReport1').hide();
    $('.dailyReport2').show();
}

window.dailyReport = function(){
    var today = "今日事项：\n";
    var tomorrow = "明日事项：\n";
    var li = $('ul.board-view>li');
    var cards = li.find('ul li');
    var todayIndex = 1;
    var tomorrowIndex = 1;
    cards.each(function(index,item){
        var card = $(this);
        var checkbox = card.find('input[type=checkbox]');
        console.log(checkbox)
        checkbox.each(function(){
            if(!$(this).is(':checked')){
                return;
            }
            if($(this).val() === '1'){
                today += todayIndex+'.'+card.find('.card-name').html()+'\n';
                todayIndex ++;
            }
            if($(this).val() === '2'){
                tomorrow += tomorrowIndex+'.'+card.find('.card-name').html()+'\n';
                tomorrowIndex ++;
            }
        })
    });
    $('#dailyReportTextarea').val(today+'\n'+tomorrow);
    $('#dailyReportTextarea').dialog({
        width: 800, height: 600,
        open: function(){$('#dailyReportTextarea').css('width','100%').css('hight','100%');},
        close: function(){
            $('#dailyReportTextarea').remove();
            $('.ui-dialog').remove();
            $('.beforeTextarea').after('<textarea id="dailyReportTextarea" style="display:none;font-size:16px"></textarea>');
        }
    });
}

window.dailyReportCancel = function(){
    $('.dailyReportCheckbox').remove();
    $('.dailyReport1').show();
    $('.dailyReport2').hide();
}

window.isContains = function(o,str){
    return o.indexOf(str) > -1;
}

window.getYesterdayTodayAndTomorrow = function() {
  var yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  var today = new Date();
  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  var formatDate = function(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();

    return year + '/' + month + '/' + day;
  };

  return {
      yesterday: formatDate(yesterday),
      today: formatDate(today),
      tomorrow: formatDate(tomorrow),
      tomorrowDate: tomorrow
  };
}

function formatDate1(date){
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    return year + '/' + (month>9?month:('0'+month)) + '/' + (day>9?day:('0'+day));
}

function mergeSort(arr) {
    if (arr.length < 2) {
        return arr;
    }
    const mid = Math.floor(arr.length / 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);
    return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
    let arr = [];
    while (left.length && right.length) {
        if (new Date(left[0][0]) < new Date(right[0][0])) {
            arr.push(left.shift());
        } else {
            arr.push(right.shift());
        }
    }
    return arr.concat(left, right);
}

window.exportTable = function(){
    var cardsAll = $('ul.board-view li ul li');
    var cards = [];
    cardsAll.each(function(index,item){
        var onwer = $(this).attr('data-owners');
        if((isContains(onwer,'张书伟') || isContains(onwer,'章晓婷'))
          //&& !$(this).find('.finish-card-btn').prop('checked')
          ){
            cards.push(this);
        }
    });
    var sortCards = {};
    $.each(cards,function(index,item){
        var cardName = $(item).find('.card-name').html();
        if(isContains(cardName,'（') && !isContains(cardName,'律师函')){
            var vsIndex = cardName.indexOf('VS')>-1?cardName.indexOf('VS'):(cardName.indexOf('vs')>-1?cardName.indexOf('vs'):(cardName.indexOf('TO')>-1?cardName.indexOf('TO'):(cardName.indexOf('to')>-1?cardName.indexOf('to'):cardName.indexOf('）'))));
            var corp = cardName.substring(cardName.indexOf('（')+1,vsIndex);
            var date = $(item).find('.begin-date').html();
            date = date?date:$(item).find('.date').html();
            date = date||'';
            var state = $(item).parent().parent().parent().find('.title-name').html()
            if(!sortCards[corp]){
                sortCards[corp] = [];
            }
            sortCards[corp].push({cardName:cardName,date:date,state:state});
        }
    })
    var html = '<thead style="text-align:center"><tr><th>公司名</th><th>事项</th><th>开始时间</th><th>状态</th></tr></thead><tbody style="text-align:center">';
    for(var key in sortCards){
        $.each(sortCards[key],function(index,item){
            if(index === 0){
                html += '<tr><td rowspan="'+sortCards[key].length+'">'+key+'</td><td>'+item.cardName+'</td><td>'+item.date+'</td><td>'+item.state+'</td></tr>';
            }else{
              html += '<tr><td>'+item.cardName+'</td><td>'+item.date+'</td><td>'+item.state+'</td></tr>';
            }
        })
    }
    html += '</tbody>';
    $('#exportTable table').html(html);
    $('#exportTable').dialog({
        width: 800, height: 600,
        open: function(){$('#exportTable').css('width','100%').css('hight','100%');$('#exportTable td').css('border','1px solid #aaa');$('#exportTable th').css('border','1px solid #aaa').css('text-align','center').css('weight','bold')},
        close: function(){
            $('#exportTable').remove();
            $('.ui-dialog').remove();
            $('.beforeTable').after('<div id="exportTable" style="display:none;font-size:16px;height:600px;overflow:scroll"><table></table><div>');
        }
    });
}