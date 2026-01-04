// ==UserScript==
// @name         唯e付供货系统
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  try to take over the world!
// @author       You
// @match        http://www.nanjj.com/index.aspx
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39006/%E5%94%AFe%E4%BB%98%E4%BE%9B%E8%B4%A7%E7%B3%BB%E7%BB%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/39006/%E5%94%AFe%E4%BB%98%E4%BE%9B%E8%B4%A7%E7%B3%BB%E7%BB%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';

     $.getScript("https://cdn.bootcss.com/jplayer/2.9.2/jplayer/jquery.jplayer.min.js", function() {
        $("#jplayer").jPlayer({
            // swfPath: "http://www.jplayer.org/latest/js/Jplayer.swf",
            ready: function () {
                $(this).jPlayer("setMedia", {
                    mp3: "http://hao.1015600.com/upload/ring/000/994/63ac8513b87bb67e87042b856e2b6f01.mp3"
                });
            },
            supplied: "mp3"
        });
    });

       /**/
    var cnt = 0;
    var stop = 0;
     //$("#btn_search").attr("type", "button");
    $("#btn_search").after("<input type='button' name='btn_search' value='自动抢单' id='my_btn_search' class='scbtn'>");
    $("#my_btn_search").after("<input type='button' name='btn_stop' value='停止抢单' id='my_btn_stop' class='scbtn'>");
    $("#my_btn_stop").after("<button type='button' name='btn_copy'  id='my_btn_copy' class='scbtn'>复制 </button>");
    $("#my_btn_copy").after("<div id='jplayer'></div>");
    $("#my_btn_stop").attr('disabled', 'disabled');
    $("#btn_search").remove();

    $('#my_btn_search').click(function() {
        $("#my_btn_search").attr('disabled', 'disabled');
        $("#my_btn_stop").attr('disabled', false);
        localStorage.setItem('TICKET_PRICE', $('#ddl_pricetag').val());
        stop = 0;
        Refresh();
    });

    $('#my_btn_stop').click(function() {
        $("#my_btn_search").attr('disabled', false);
        $("#my_btn_stop").attr('disabled', 'disabled');
        $('#my_btn_search').val("自动抢单");
        cnt = 1;
        stop = 1;
    });


    var Refresh = function() {
          if (stop == 1) return ;
          var price = $('#ddl_pricetag').val();
          $('#my_btn_search').val("查询" + cnt + "次");
          $.get("index.aspx", function(msg) {
              cnt ++;
              if(msg.indexOf(price + " ：0 笔") > 0 || msg.indexOf(price + "：0 笔") > 0) {
                   setTimeout(Refresh, 300);
              }
              else {
                   var data = {
                       ddl_type: $('ddl_type').val(),
                       ddl_pricetag: $('#ddl_pricetag').val(),
                       ddl_count: $('#ddl_count').val(),
                       ddl_address: $('#ddl_address').val(),
                       btn_search: '获取订单',
                       makesureOrderId: '',
                       __ASYNCPOST: true,
                       ScriptManager1: 'UpdatePanel1|btn_search',
                       __EVENTTARGET: "",
                       __EVENTARGUMENT: "",
                       __VIEWSTATE: "Tw3UpBJLuqA8IzjTTuWk1sRm1Qlehe1IeJnY7FT/Z+8RNoQUjcDIhj6f7bE6e10kd651Cx0gIA4xTHiuBFdxT0Ijzpb3d3Sktz1pqQ00fN5VIhuH6KSyCSmDXUsFp6wK3c09sGelP+q6kAowy1hwvSXRQ/Mg2K53uVXjuZEFy0su80PehJf/KYAyInGproLwTkkHaic3N4YVlqeiBnYWYgRVQlWtp6w/O+YBdAjeSZzFiVmrZYXAnOGiaqDN2N0fOFsrSjWCxJuZkpvS591Sx3S7FJW4+TAlGdGBVZS8BFAdg0Mt8L1f/ZSV7qgCpk8ydy45UUnC+OTIwceOb3JHVV8WuHDsrRJyXGbd6rWe7o886Ihy1dFGlbpRqzL/BB1HRdi2b2TEQN2+aBbgbYVz4aEOlcChanOHFPSTVRiQqC8FODC6IagBMDiSqVE8thDIX9Uu2WmWL+J8Jg/j2Dc0NI77RrArwRQkZG9zoMdZ8zpZ/FANwaCYVCF05PYscUrkem4GypHvsnpecN98VpS4sPfShksoULdH+jlIjEufmSlg6160m4PgpMpB6E0aprZ0wlsjCeCrXBkjixqgutmK72ljszO8WpTM/aranX9m7OhYAmQsW++2CcQaNNTXmgRJlqvgcmpriKhSt6cGQSJrpLHzNV+qx9ZQu8YnNoq8c39Gn8WwQKHsgkxVguLRtaFaRI4/FyPy0EMj8KjgOTnimtAwr0fPt5Drlh4cX4dU5ehkNKKVHUC/NJnSlH6NO+gJEI3h8CRtQJSW1X9LeuzUIGRAHvpKc5gS0Y/6lC5Dtc9u4wcv7liL3bDiJFcdvx6i89px8jiN9m82RT86034m15rq2y7p9Ovv06+Lgbv2QoQ=",
                       __EVENTVALIDATION: "Q2zT8QvlYh1Br+O+tot8BVO5R8ZIz6i3hrea9LmxtwdvIeUhVjXrPFCMYW6GS3OF6Mky07D1VpcH4vbuv9NPi+J1v8zXKQEHvxdCkPKlYDyLMCrP72BnUZbGd+MOSqXz8ow2NOJebJzSeulWF+BykNQj3KfWivPgoOn2Kbu7Acv+wkDWmZ6kPfKTs/pTXmPJemV1j/9Y6uO0gzs+ogOm02jU3hWt4MaYkEu6MVDcKWHpIl35wjWlfljd2UIaPfaVlUEU/4uSNWlqXfWKlcbNgSl+ODry1rTlx0Ss1qWUWnLwjs43KATnRUKLmtF64OIQGDk8Wh9s0asMb4y++9oisrbCx6ueJQh9fKWZReYPp2MkNve8xeSM8yzKzfQsavJamITeRE82bgO8ygoZ731Hrg/zqNGyRbO1H9kJEfaBwWZW5evJBAibDxfoZVQjH+UbSav+xqOLs8saoN29Se+qfb2bbFtRHy17/Zs4y+AZmPTglhMQEwUNg5jTMQbWy5NaQIAjhJOIN6cPTMFM+HGlpIvHyheJ+rUeseYAQvda6gh+usdm41RdQjyHCs7snTP9VuvISOyh0FC4AHolRQPWVBD8L6FzE/3+ngU/EqG4lbrNRU7stQ1jyuSlzmVOiueZZ9utpgf3W4qG9r1hkFG6OEkd95V/omMcf8PCePtTwk5P2TOtDevO2V3X7zTjzcyxF9aRYs/DeeshEUl8WfNT3g7BaKfrjR4zFJEOS2FzcaTViTqL0MDw/Y17BjKaJt60/EjL59V/ugyh8gG6CLOGeFUAP/jK96TY7i4+vTaq+e+e9eaX9xGJrY6xJ0fzXgTtLnL+oCX0T99cXK3X8AQA8AU5JKSgEBaIf/7s1iYisYSKTSZYLDGYGc9NY8xbu22zXA5ZtV6yBU6HKL6s/8sZZe0ghcnv4A6KqXsot3Mly3mOtYdlEKVHSIyjQgawAdsinPj1LwBmoI50Mq9Dlf6FwtJTMKSGPrXep1n3H99gO6/wEjcafMFdQbhrw7uHuG+K+iQGO4Ex0qU1SjU2GkyDnakbJ215efA6RRMNbIjeMtko4nFdKH2Frrg3ECz2iLpaSiR/3uZAtcg40H2dVH2HmNLI9qGLQtOG/HLijAko5SI7OF/aOSb7CIfFFcRaEaLbNl2tMCT86HmFrsJ1MSfGTExsqQ2pjQ+OBaWw/J+1ZTWf2iSZ0gZ0kLqY7CmqN3BFZD0QockYIO0fF0594xXlRa3md3c84jOelBr68MO5CcVuTztGZwz5Zwm6F7G2i0o6STBTsoot8uTNG38/4nyVtHQfFmfs8GshPPavIJWb8faAzZbZiSyJKfIrt6yZ5wf3YXiXqpsyozCtT+H7qgWd8/ZpkwSWwIOdK0Pc53V+lkV606e+Ok7m9AwnfzdP8mteqqyax6jdbDIof3Ocr02SIips3I/LiJxzErUnC/LOEnV6mcMBMRDidhDjqRWX+WAegufOSeARoqJmkWfU3JMFrlNVDV2avazoQxTdbwzVA2tPUNOiHhTAfDk8WB/Zp/KX"
                   };
                   $.post("index.aspx", data, function(msg) {
                    if(msg.indexOf("暂无订单")>0) {
                       setTimeout(Refresh, 1000);
                    }
                    else {
                        //
                       $("#jplayer").jPlayer('play');
                       setTimeout(function() {
                           window.location.href = 'index.aspx';
                        }, 1000);
                    }
                });
              }

          });

    };
    if(localStorage.getItem('TICKET_PRICE') != null) {
          // alert(localStorage.getItem('TICKET_PRICE'));
          $('#ddl_pricetag').find("option:selected").attr("selected",false);
          $('#ddl_pricetag').find("option[value='"+ localStorage.getItem('TICKET_PRICE')+"']").attr("selected",true);
    }

     $.getScript("https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.0/clipboard.min.js", function() {
       // alert("succ");
        console.log('clipboard.js loaded');
        if($('tr').size() > 1) {
            var number = $('#UpdatePanel1 > table > tbody > tr > td:nth-child(2) > input[type="text"]').val();
            //var test = $('tr').eq(0).find('th').eq(1).text().replace(/^\s+|\s+$/g,"");

            var clipboard = new ClipboardJS('#my_btn_copy', {
                text: function(trigger) {
                    return number;
                }
            });
            clipboard.on('success', function(e) {
                e.clearSelection();
                $("#my_btn_copy").text('复制成功');
            });

        }
    });

    // Your code here...
})();