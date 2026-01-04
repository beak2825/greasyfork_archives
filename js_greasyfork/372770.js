// ==UserScript==
// @name        Kat Torrent List Sort
// @namespace   Sality
// @description Kat Torrent List Sort V0.2
// @include     *katcr.co/*
// @version     0.3 Beta
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/372770/Kat%20Torrent%20List%20Sort.user.js
// @updateURL https://update.greasyfork.org/scripts/372770/Kat%20Torrent%20List%20Sort.meta.js
// ==/UserScript==

var SortTypeIndex={
    NAME:0,
    SIZE:1,
    FILES:2,
    AGE:3,
    SEED:4,
    LEECH:5
};

try{
$('head').append('<style>.SortAsc{background:url(https://katcr.co/show/community/Themes/default/images/sort_up.gif) no-repeat top left;margin-left:3px;display: inline-block;height: 12px;width: 12px;} '
                      +'.SortDesc{background:url(https://katcr.co/show/community/Themes/default/images/sort_down.gif) no-repeat top left;margin-left:3px;display: inline-block;height: 12px;width: 12px;}</style>');
              $('table.torrents_table thead tr th').each(function(index){
                  $(this).append('<span class="SortAsc" title="Ascending Sort" col="'+index+'"></span>');
                  $(this).append('<span class="SortDesc" title="Descending Sort" col="'+index+'"></span>');
              });
}
    catch(ex){
        console.log('If The script is not Working , please Inform Sality !');
        }

$(document).on('click','.SortAsc',function(){
    var dataAray=GetSortedData($(this).attr('col'));
    BindData('table.torrents_table tbody',dataAray);
    dataAray.map(function(elm,i){
        console.log(elm.sortValue);
         });
});

$(document).on('click','.SortDesc',function(){
    var dataAray=GetSortedData($(this).attr('col'));
    dataAray.reverse();
    BindData('table.torrents_table tbody',dataAray);
});

function GetSortedData(column){
    var col=column;
    var dataAray=[];
    $('table.torrents_table tbody tr').each(function(){
                  var sortValue;
                if(col==SortTypeIndex.SEED||col==SortTypeIndex.LEECH||col==SortTypeIndex.FILES){
                  sortValue=Number($.trim($(' td:eq('+col+')',$(this)).text().replace('\n','')));
                }
                else if(col==SortTypeIndex.NAME){
                sortValue=$('.torrents_table__torrent_title b',$(this)).text();
                }
                else if(col==SortTypeIndex.AGE){
                sortValue=Date.parse($.trim($(' td:eq('+col+')',$(this)).attr('title')));
                }
                else if(col==SortTypeIndex.SIZE){
                sortValue=$.trim($(' td:eq('+col+')',$(this)).text().replace('\n',''));
                    if(sortValue.includes("GB")){
                        sortValue=parseFloat($.trim(sortValue.replace("GB")))*(1024*1024);
                    }
                    else if(sortValue.includes("MB")){
                        sortValue=parseFloat($.trim(sortValue.replace("MB")))*(1024);
                    }
                    else if(sortValue.includes("KB")){
                        sortValue=parseFloat($.trim(sortValue.replace("GB")));
                    }
                }
                  dataAray.push({html:$(this).html(),sortValue:sortValue});
              });

                if(col==SortTypeIndex.SEED||col==SortTypeIndex.LEECH||col==SortTypeIndex.FILES||col==SortTypeIndex.SIZE){
                  dataAray.sort(compareNumber);
                }
                else if(col==SortTypeIndex.NAME){
                    dataAray.sort(compareText);
                }
    else if(col==SortTypeIndex.AGE){
                    dataAray.sort(compareNumber);
                    dataAray.reverse();
                }
        return dataAray;


}

function compareNumber(a,b) {
  return a.sortValue-b.sortValue;
}
function compareText(a, b) {
  var nameA = a.sortValue.toUpperCase();
  var nameB = b.sortValue.toUpperCase();
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }
  return 0;
}

function BindData(selector,obj){
    $(selector).empty();
    obj.forEach(function(element) {
        $(selector).append('<tr>'+element.html+'</tr>');
    });

}