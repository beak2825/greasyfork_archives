// ==UserScript==
// @name         国联供货
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://zb.tongyun188.com/index.aspx
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368454/%E5%9B%BD%E8%81%94%E4%BE%9B%E8%B4%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/368454/%E5%9B%BD%E8%81%94%E4%BE%9B%E8%B4%A7.meta.js
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
                       ddl_pricetag: $('#ddl_pricetag').val(),
                       ddl_count: $('#ddl_count').val(),
                       ddl_address: $('#ddl_address').val(),
                       btn_search: '获取订单',
                       makesureOrderId: '',
                       __ASYNCPOST: true,
                       ScriptManager1: 'UpdatePanel1|btn_search',
                       __VIEWSTATEGENERATOR: 90059987,
                       __EVENTTARGET: "",
                       __EVENTARGUMENT: "",
                       __VIEWSTATE: "O+/oapHGud8WYxlah4977s2bX+Sn46TxhPL3EyCmnfyav0Fq444gG2iKvfFVo2O98bbSndKZAEEIFLuNo+hpy+DOrc4gijNcwh9e7oxMmk+QqILBw1kbSbviM7OYxjg3afLAkjdrPZ/Za3yIK1D+dTSjcoZMPYTkJ/8V7aj5ADTtwDkC0n7j6BX+jdDjuGyOLVCpzCHPU6o3f0YTOkgNi/n+78zfmk1FuEwpyTQv/tVJpoasbutWWSd80bzThacywb7KmTDdIy0cXGAn6EW1MfSdyjmdpabHOx4cBYb0TIpvQLFVW8ut+2n1ettHnmZv/P1C8Wd+a7UDMXVWrREhOoB6P9e0qI912I63iEMNsyJSGhjf2O4+EUyv9D07HQgQvVpHv7IMBYC6LVLIJFISP4c3BS0GEaAh7kFqBD9K1bGlctl1WWrRH0Wxr4c4+7TRtzLZvWcZWLRARxyHoDBp+ph8MwTXu5qducGGt7R1ZvVWhq8AEj/AEfRbp8oYX4i0m2WugsKp9td3lYnfzOhgkt9sktUUL4Q4DAprb9BQFQjfJwxIYUTj+moned+jYGb9gbup/34qD+wkLPUIZ2T17Mw0Q7xk7eQ28fWCinBahfHJ4lX85qLOP2GZjAxOgwQeNKDII3S385DmYVYnGvtYIahvrRbQqe6FO3RKtjiWcwb5JWpPK6eMiMP5Wwh3aORpbcWuCTYIVP2YKpzSn+FZyKUoA869xFHqEto0Zw+ERwaE1itDK1bmGrWpZFF4GaHu3xEUz86PczBZHUmKjPBsYu5e/5NaJbKM294sTP1L5M/rJbLjc0gLbMKvTHhlKc3GypuIJJHmtoksyNBKiAIkkw==",
                       __EVENTVALIDATION: "Xs+plHmMghGp1ND7ZZexWjTKmXaxFaSgFm7d4PLZow902OvJ2nNKhh6+pg0MB9r+Sn0xDqzpEz4zpCtJGAV7sKRiJRwD6VT1hY8tDOVM/OHA/FuURuIe/AqPjoLUcwpunpAkyy/whyqttu58iArDXal3AGaIH+AZoI5AvoRUZlRQSo7oNz+aWgLTjE8uHFN2gBX74x133DVRHhnOOp6lOPytXpygTOaotmxxwziRr64n48tj0g5tKwzYJBHkruZOoiIxs4SXj1mP/hQq32E0FRSF0aWWgo7dCL3yH9sbelBDwWbzL4DRiQTfPztV7YoTwcBex4UDc4p8Hjb5huoT2Fxq6Zj1ndCe4m2jq2uE9Vvg41gZGI6hlZ4SDLy+gRrjtP8O6swroxIs3J2bhlPyN/3z2Pv9m42HAde5GBKH2W0jWqfa9Lw+4oFQFWD+G9DCY97VfO65Xh+qXx40PElI6fPcWA/S7skiwVw9gz809V2BR1JxSXlZP9ZpKNveejbQh3yiegMBg5H7PGjW6MXnx5poc+ri7S0eK7dV0Y45rleVZ5qRrKnIWH8m1N8Kye+FrssMsql9qxgzee6/4SyOOqxTnteGTmWtX2grRQY6Me4dN6v2gGaXc3uhtYhLI/1Vh5aVTf4IHpfuLvazhmwiyplAnfkmZYrlRvr+Jwdu6icST+uNlX6KXI8uvNuSldABx83xIsk5YMfwpjTRKhG9kd9ER6f608+7Yx3eVCGGfPJMcNvfl12h9rqbD1RpxXTkgT9hVccAhFUGpOAJ/nsLe3+VTs9q/diNQPx7CKoivPLhG0NWmF/5EN1k1wVW7uAxsS1xpdqC+Xld3s6UaR53iBmIkk3IF0DIbeeuIWQLeKxb92aGnJQHgR7MV2VTmZBvrOkjJDcnYiJBMiXrWfJSvqTwbpuLMBfuA4t75acPa2rxLgTJieveNOBHSB28bRhlK6nNajMujgbLvAysGMjj+tjeDbDjmWVJ9uuGTOtuU6LUoTB/056i5ZX5ERa9cln7/c49bARlz5vk4XJBnTt3sQIC8EHyAImaTauAlZ81SWDG7cAVKSaX95hdBUB7LiVLvycG3+3eik9612J4CNeZzZ5ao1kZn8vndJUzRSTT/hjlQilEdIFP2mYU60NW4dnhwzuJsI6ygZBfqQkh5Y2ujxhdjWa6Nyqysnf5P+9TbaqkUFC8wn1qDUXCNwDmNFpTWeY2326U5z2VA+N1Su63SGSHa4ICeJwf63R5O6h4NKtucrX7BmTItidGLBaM5ZopIU20dqMgjWxkjhLtqsZTZMFec2Ba5h4LiDYiDUfhaRRpLEUpzLDOLUujbzlrKdRCwUnGWlk5A+8THl6VmVUoYjesKOs8rL2bIaDjSFlh9NVAJXuE9O3vXsaGI4DugkU2bZ5GmD7FozCGrs04ImBt2ao0rqDDujeJXnqq+WU2felWv/re9qAvSDBk/6VAqzvPh/Qw7VaReu/4QSxTbWO11vYSFrFHErfkBI0EgLPg5UFhDAQUvLjeo7xaMGxArGCWf4MunQ7A2B/QbBNuMDIe/JuXwMU+Z+9Ejkit05mz1bKvLBC/Bnc/0H3BnJrFOfnR19idQx14eNKkY5Y5IfBI0SqRc2wxYr+fPM6K++vQgh9IKgsY8OBlXwqqsoqRFoai"
                   };
                   $.post("index.aspx", data, function(msg) {
                    if(msg.indexOf("暂无订单")>0) {
                       setTimeout(Refresh, 200);
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