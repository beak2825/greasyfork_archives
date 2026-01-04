// ==UserScript==
// @name         tapd-extensions-for-chenyq
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  extensions
// @author       You
// @match        https://www.tapd.cn/*/board/index*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tapd.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/482186/tapd-extensions-for-chenyq.user.js
// @updateURL https://update.greasyfork.org/scripts/482186/tapd-extensions-for-chenyq.meta.js
// ==/UserScript==

(function() {
    var checkLoad = setInterval(function(){
        if($('ul.board-view li').length > 0){
            clearInterval(checkLoad);
            $('.add-board').after('<div style="display:inline-block;margin-left:20px">'+
                                  '<button class="btn btn-primary btn-ok" onclick="autoOrder()">自动排序</button>'+
                                  '</div>');
        }
    },1000);
})();

window.autoOrder = function(index){
    $('ul.board-view li').each(function(index,item){
    var li = $(item);
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
    });
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