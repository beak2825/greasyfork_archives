// ==UserScript==
// @name         Sonarr Search Helper
// @version      0.5
// @namespace    sonarrhelper
// @author       DeQxJ00
// @description  给Sonarr加了个动画搜索的建议,在没有搜到任何结果的情况下 会显示bangumi以及MAL的搜索结果
// @include      http://yoursonarrip/*
// @grant        GM_xmlhttpRequest
// @license      GPL
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sonarr.tv

// @downloadURL https://update.greasyfork.org/scripts/442188/Sonarr%20Search%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/442188/Sonarr%20Search%20Helper.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const path = "";//如果有path的域名 写上带path的url的绝对路径 不带path的不用管
    const showlimit = 3;//bgm和mal显示个数限制
    const resultcount = 7;//有搜索结果时候 但是搜索结果较少 也会显示补充内容
    const config = { attributes: true, childList: true, subtree: true };
    const callback = function(mutationsList, observer) {
        for(const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                if (mutation.target.classList.length > 0) {
                    //console.log(mutation.target.classList[0]);
                    if (mutation.target.classList[0].startsWith('PageContentBody-innerContentBody-V-w79')) {
                        var adiv=$(mutation.target).find('div#add');
                        var divs=$(mutation.target).find('div.AddNewSeries-message-3EQNm');
                        var divs_append=divs;
                        //有搜索结果 结果较少的情况。
                        if(divs.length == 0){//有搜索结果时候
                            var divs2=$(mutation.target).find('div.AddNewSeriesSearchResult-searchResult-2y3MD');
                            if(divs2.length <= resultcount){//有搜索结果时候 但是搜索结果较少
                                divs = divs2;
                                divs_append = $(mutation.target).find('div.AddNewSeries-searchResults-3wUPw');;
                            }
                        }//else无结果的时候
                        if(divs.length>0 && adiv.length==0){
                            divs_append.append("<div id='add'>======================================</br><a>搜索名建议 建议先点日文搜索 不行再用英文的</a></div>");
                            var searchbox=document.getElementsByClassName('AddNewSeries-searchInput-3EW99 TextInput-input-20YDM Input-input-25Gr2')[0];
                            var searchvalue=searchbox.value;
                            $.getJSON('https://api.bgm.tv/search/subject/'+searchvalue+'?type=2', function(data) {
                                //console.log(data.list);
                                var table = "<div><table border='1' style='float:left'>";
                                $.each(data.list, function(i, field){
                                    if(i >= showlimit){
                                        return false;
                                    }
                                    table+=("<tr>");
                                    var imgurl = "";
                                    if(field.images!=null){
                                       imgurl=field.images.medium;
                                    }
                                    table+=("<td><img src="+imgurl+"></td>");
                                    table+=("<td>"+
                                            "JP <a href='"+path+"/add/new?term="+field.name+"'>"+field.name+"</a></br>"+
                                            "CN <a href='"+path+"/add/new?term="+field.name_cn+"'>"+field.name_cn+"</a></br>"+
                                            "</br>"+
                                            "<a target='_blank' href="+field.url+">Bangumi Link</a></br>"+
                                            "</td>");
                                    table+=("</tr>");
                                });
                                table+="</table></div>"
                                divs_append.append(table);
                            });
                            GM_xmlhttpRequest({
                                method: 'GET',
                                url: 'https://myanimelist.net/search/prefix.json?type=anime&v=1&keyword='+searchvalue,
                                headers:{"Content-Type": "application/json"},
                                onload: response => {
                                    if (response.status == 200) {
                                        var data = JSON.parse(response.responseText);
                                        //console.log(data.categories[0].items);
                                        var table = "<div><table border='1' style='margin-left:10px;float:left'>";
                                        $.each(data.categories[0].items, function(i, field){
                                            if(i >= showlimit){
                                               return false;
                                            }
                                            table+=("<tr>");
                                            table+=("<td><img src="+field.image_url+"></td>");
                                            table+=("<td>"+
                                                    "EN <a href='"+path+"/add/new?term="+field.name.replaceAll(' ','%20')+"'>"+field.name+"</a></br>"+
                                                    field.payload.aired+"</br>"+
                                                    "</br>"+
                                                    "<a target='_blank' href="+field.url+">MAL Link</a></br>"+
                                                    "</td>");
                                            table+=("</tr>");
                                        });
                                        table+="</table></div>"
                                        divs_append.append(table);
                                    }
                                }
                            });
                        }
                    }
                }
            }
        }
    };
    const observer = new MutationObserver(callback);
    observer.observe(document.body, config);
    //observer.disconnect();
})();