// ==UserScript==
// @name         云科订单
// @version      1.0
// @author       516728@qq.om
// @namespace    https://greasyfork.org/zh-CN/users/
// @match        *://fxg.jinritemai.com/ffa/morder/order/list
// @date         05/27/2021
// @description  方便抖音订单查看,必须要打开抖音小店的订单管理界面，才能显示
// @icon         https://mms0.baidu.com/it/u=685985501,228922170&fm=27&gp=0.jpg&fmt=auto
// @run-at       document-end
// @note         2.5  @updateURL/@installURL/@downloadURL https://greasyfork.org/zh-CN/scripts/431480
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdn.staticfile.org/datatables/1.10.9/js/jquery.dataTables.min.js
// @resource     dashixiongCSS https://gitee.com/da-shixiong/ajax/raw/master/hs/dataTables/min.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        window.close
// @grant        window.focus
// @grant        window.onurlchange
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/435995/%E4%BA%91%E7%A7%91%E8%AE%A2%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/435995/%E4%BA%91%E7%A7%91%E8%AE%A2%E5%8D%95.meta.js
// ==/UserScript==

window.onload = (function() {
    "use strict";

    GM_addStyle(GM_getResourceText("dashixiongCSS"));
    var dsx = {
        xiaodianming:"",
        xiaodianID:"",

        baocunshuju: function(obj){
            let jsonshuju = dsx.shujuzhuanshuzu(obj);
            GM_xmlhttpRequest({
                method: 'POST',
                url: "http://other.jxmarket1.cn/test/csv",
                //url: "http://ftp6485842.host120.sanfengyun.cn/server/csv.php",
                headers: {
                    'Accept': 'application/json; charset=utf-8'
                },
                data : JSON.stringify(jsonshuju),
                cookie : "zhujiwusysdomain=ftp6485842.host120.sanfengyun.cn",
                onload: function(res) {
                    //console.log(res.responseText);
                }
            });
        },

        jiazaishuju: function(name,offset,len){
            GM_xmlhttpRequest({
                method: 'POST',
                url: "http://other.jxmarket1.cn/test/csva",
                //url: "http://ftp6485842.host120.sanfengyun.cn/server/getdata.php",
                headers: {
                    'Accept': 'application/json; charset=utf-8'
                },
                data : JSON.stringify({"name":name,"offset":offset,"len":len}),
                cookie : "zhujiwusysdomain=ftp6485842.host120.sanfengyun.cn",
                onload: function(res) {
                    console.log("php返回数据：",dsx.xiaodianming,res.responseText);
                }
            });
        },

        shujuzhuanshuzu: function(obj){
            let jsonshuju = {"name": dsx.xiaodianming};
            let arr = new Array();
            if($.isPlainObject(obj)){
                arr[0] = dsx.jiexijsonshuju(obj);
            }else if($.isArray(obj)){
                $.each(obj,function(i,item){
                    arr[i] = dsx.jiexijsonshuju(item);
                });
            };
            jsonshuju.data = arr;
            return jsonshuju;
        },

        jiexijsonshuju: function(item){
            //{"name":"幸福的人-123","data":[["0抖音昵称","1收件人","2手机号","3省份","4城市","5城镇/区","6街道","7详细地址","8订单id","9订单金额","10订单时间","11订单状态","12订单详情","13user_id","14支付类型","15运费"]]}
            let arr = new Array();
            arr[0] = item.user_nickname;
            try{arr[1] = item.receiver_info.post_receiver}catch(e){arr[1] = "没有"};
            try{arr[2] = item.receiver_info.post_tel}catch(e){arr[2] = "没有"};
            try{arr[3] = item.receiver_info.post_addr.province.name}catch(e){arr[3] = "没有"};
            try{arr[4] = item.receiver_info.post_addr.city.name}catch(e){arr[4] = "没有"};
            try{arr[5] = item.receiver_info.post_addr.town.name}catch(e){arr[5] = "没有"};
            try{arr[6] = item.receiver_info.post_addr.street.name}catch(e){arr[6] = "没有"};
            try{arr[7] = item.receiver_info.post_addr.detail}catch(e){arr[7] = "没有"};
            arr[8] = item.shop_order_id;
            arr[9] = item.pay_amount / 100;
            try{arr[10] = dsx.formatDate(item.create_time)}catch(e){arr[10] = "没有"};
            arr[11] = item.order_status_info.order_status_text;
            let dingdanxinxi = "";
            $.each(item.product_item, function(j, d){
                let biaoti = "【" + (j+1) + "标题】" + d.product_name;
                let sku = "【" + (j+1) + "SKU】" + d.merchant_sku_code;
                let img = "【" + (j+1) + "首图】" + d.img;
                let id = "【" + (j+1) + "订单ID】" + d.item_order_id;
                let huaxianjia = "【" + (j+1) + "划线价】" + d.combo_amount/100;
                let jiage = "【" + (j+1) + "价格】" + d.total_amount /100;
                dingdanxinxi += biaoti + "\n" + sku + "\n" + img + "\n" + id + "\n" + huaxianjia + "\n" + jiage + "\n";
                let xingzhi = "";
                $.each(d.properties, function(k, e){
                    xingzhi += "【" + (j+1) +"性质"+ (k+1) + "】" + e.text + "\n";
                });
                dingdanxinxi += xingzhi;
                let biaoqian = "";
                $.each(d.tags, function(k, e){
                    biaoqian += "【" + (j+1) +"标签"+ (k+1) + "】" + e.text + "\n";
                });
                dingdanxinxi += biaoqian;
            });
            arr[12] = dingdanxinxi;
            arr[13] = item.user_id;
            arr[14] = item.pay_type_desc;
            let yunfei = "";
            $.each(item.pay_amount_detail, function(j, d){
                let name = d.name;
                let amount = d.amount;
                yunfei += name + amount + "\n";
            });
            arr[15] = yunfei;
            //console.log(arr);
            return arr;
        },

        formatDate: function(data) {
            //时间戳转格式
            let timestamp = new Date(data * 1000);
            let year = timestamp.getFullYear();
            let month = timestamp.getMonth() + 1;
            let date = timestamp.getDate();
            let hour = timestamp.getHours();
            let minute = timestamp.getMinutes();
            let second = timestamp.getSeconds();
            return (year + "-" + th(month) + "-" + th(date) + " " + th(hour) + ":" + th(minute) + ":" + th(second));
            function th(num) {
                return num < 10 ? "0" + num : num;
            }
        },

        Toast: function(msg, duration) {
            duration = isNaN(duration) ? 1000 : duration;
            let m = document.createElement('div');
            m.innerHTML = msg;
            m.style.cssText = "max-width:60%;min-width: 150px;padding:0 14px;height: 40px;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 999999999999999;background: rgba(0, 0, 0,.7);font-size: 16px;";
            document.body.appendChild(m);
            setTimeout(function() {
                let d = 0.5;
                m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
                m.style.opacity = '0';
                setTimeout(function() {
                    document.body.removeChild(m)
                },d * 1000);
            },duration);
        },

        movedom: function(domstr){
            $(domstr).mousemove(function(e){
                $(domstr).unbind("mousedown");
                $(domstr).css("cursor","default");
                //$("span > b").text(parseInt($("div").width()));
                var left = $(domstr).offset().left - $(document).scrollLeft();
                var top = $(domstr).offset().top - $(document).scrollTop();

                // 如果鼠标在中间
                if(e.clientX - left > 10 && e.clientX-left < parseInt($(domstr).width()) - 10
                   && e.clientY - top > 10 && e.clientY-top < 60) {
                    $(domstr).css("cursor","move");
                    $(domstr).mousedown(function(e) {
                        var ismove = true;
                        var x = e.pageX - $(domstr).offset().left + $(document).scrollLeft();
                        var y = e.pageY - $(domstr).offset().top + $(document).scrollTop();
                        $(document).mousemove(function(e) {
                            if(ismove) {
                                $(domstr).css({"left":e.pageX - x, "top":e.pageY - y});
                            }
                        }).mouseup(function() {
                            ismove = false;
                        });
                    });
                }

                //如果鼠标在左上角
                if(e.clientX - left < 10 && e.clientY - top < 10) {
                    $(domstr).css("cursor","nw-resize");
                    $(domstr).mousedown(function(e) {
                        var ismove = true;
                        var y = e.pageY - $(domstr).offset().top + $(document).scrollTop();
                        var h = e.pageY + parseInt($(domstr).css("height"));
                        $(document).mousemove(function(e) {
                            if(ismove) {
                                $(domstr).css({"height":h - e.pageY, "top":e.pageY - y});
                            }
                        }).mouseup(function() {
                            ismove = false;
                        });
                    });
                    $(domstr).mousedown(function(e) {
                        var ismove = true;
                        var x = e.pageX - $(domstr).offset().left + $(document).scrollLeft();
                        var w = e.pageX + parseInt($(domstr).css("width"));
                        $(document).mousemove(function(e) {
                            if(ismove) {
                                $(domstr).css({"width":w - e.pageX, "left":e.pageX - x});
                            }
                        }).mouseup(function() {
                            ismove = false;
                        });
                    });
                };

                //如果鼠标在上
                if(e.clientY - top < 10 && e.clientX - left > 10 && e.clientX-left < parseInt($(domstr).width()) - 10) {
                    $(domstr).css("cursor","n-resize");
                    $(domstr).mousedown(function(e) {
                        var ismove = true;
                        var y = e.pageY - $(domstr).offset().top + $(document).scrollTop();
                        var h = e.pageY + parseInt($(domstr).css("height"));
                        $(document).mousemove(function(e) {
                            if(ismove) {
                                $(domstr).css({"height":h - e.pageY, "top":e.pageY - y});
                            }
                        }).mouseup(function() {
                            ismove = false;
                        });
                    });
                };

                //如果鼠标在右上角
                if(e.clientY - top < 10 && e.clientX-left > parseInt($(domstr).width()) - 10) {
                    $(domstr).css("cursor","ne-resize");
                    $(domstr).mousedown(function(e) {
                        var ismove = true;
                        var y = e.pageY - $(domstr).offset().top + $(document).scrollTop();
                        var h = e.pageY + parseInt($(domstr).css("height"));
                        $(document).mousemove(function(e) {
                            if(ismove) {
                                $(domstr).css({"height":h - e.pageY, "top":e.pageY - y});
                            }
                        }).mouseup(function() {
                            ismove = false;
                        });
                    });
                    $(domstr).mousedown(function(e) {
                        var ismove = true;
                        var x = e.pageX - $(domstr).offset().left + $(document).scrollLeft();
                        var w = e.pageX - parseInt($(domstr).css("width"));
                        $(document).mousemove(function(e) {
                            if(ismove) {
                                $(domstr).css({"width":e.pageX - w});
                            }
                        }).mouseup(function() {
                            ismove = false;
                        });
                    });
                };

                //如果鼠标在右
                if(e.clientX-left > parseInt($(domstr).width()) - 10 && e.clientY - top > 10 && e.clientY-top  < parseInt($(domstr).height()) - 10) {
                    $(domstr).css("cursor","e-resize");
                    $(domstr).mousedown(function(e) {
                        var ismove = true;
                        var x = e.pageX - $(domstr).offset().left + $(document).scrollLeft();
                        var w = e.pageX - parseInt($(domstr).css("width"));
                        $(document).mousemove(function(e) {
                            if(ismove) {
                                $(domstr).css({"width":e.pageX - w});
                            }
                        }).mouseup(function() {
                            ismove = false;
                        });
                    });
                };

                //如果鼠标在右下
                if(e.clientX-left > parseInt($(domstr).width()) - 10 && e.clientY-top  > parseInt($(domstr).height()) - 10) {
                    $(domstr).css("cursor","se-resize");
                    $(domstr).mousedown(function(e) {
                        var ismove = true;
                        var x = e.pageX - $(domstr).offset().left + $(document).scrollLeft();
                        var w = e.pageX - parseInt($(domstr).css("width"));
                        $(document).mousemove(function(e) {
                            if(ismove) {
                                $(domstr).css({"width":e.pageX - w});
                            }
                        }).mouseup(function() {
                            ismove = false;
                        });
                    });
                    $(domstr).mousedown(function(e) {
                        var ismove = true;
                        var y = e.pageY - $(domstr).offset().top + $(document).scrollTop();
                        var h = e.pageY - parseInt($(domstr).css("height"));
                        $(document).mousemove(function(e) {
                            if(ismove) {
                                $(domstr).css({"height":e.pageY - h});
                            }
                        }).mouseup(function() {
                            ismove = false;
                        });
                    });
                };

                //如果鼠标在下
                if(e.clientY-top  > parseInt($(domstr).height()) - 10 && e.clientX - left > 10 && e.clientX-left < parseInt($(domstr).width()) - 10) {
                    $(domstr).css("cursor","s-resize");
                    $(domstr).mousedown(function(e) {
                        var ismove = true;
                        var y = e.pageY - $(domstr).offset().top + $(document).scrollTop();
                        var h = e.pageY - parseInt($(domstr).css("height"));
                        $(document).mousemove(function(e) {
                            if(ismove) {
                                $(domstr).css({"height":e.pageY - h});
                            }
                        }).mouseup(function() {
                            ismove = false;
                        });
                    });
                };

                //如果鼠标在左下
                if(e.clientY-top  > parseInt($(domstr).height()) - 10 && e.clientX - left < 10) {
                    $(domstr).css("cursor","sw-resize");
                    $(domstr).mousedown(function(e) {
                        var ismove = true;
                        var x = e.pageX - $(domstr).offset().left + $(document).scrollLeft();
                        var w = e.pageX + parseInt($(domstr).css("width"));
                        $(document).mousemove(function(e) {
                            if(ismove) {
                                $(domstr).css({"width":w - e.pageX, "left":e.pageX - x});
                            }
                        }).mouseup(function() {
                            ismove = false;
                        });
                    });
                    $(domstr).mousedown(function(e) {
                        var ismove = true;
                        var y = e.pageY - $(domstr).offset().top + $(document).scrollTop();
                        var h = e.pageY - parseInt($(domstr).css("height"));
                        $(document).mousemove(function(e) {
                            if(ismove) {
                                $(domstr).css({"height":e.pageY - h});
                            }
                        }).mouseup(function() {
                            ismove = false;
                        });
                    });
                };

                //如果鼠标在左
                if(e.clientX - left < 10 && e.clientY - top > 10 && e.clientY-top < parseInt($(domstr).height()) - 10) {
                    $(domstr).css("cursor","w-resize");
                    $(domstr).mousedown(function(e) {
                        var ismove = true;
                        var x = e.pageX - $(domstr).offset().left + $(document).scrollLeft();
                        var w = e.pageX + parseInt($(domstr).css("width"));
                        $(document).mousemove(function(e) {
                            if(ismove) {
                                $(domstr).css({"width":w - e.pageX, "left":e.pageX - x});
                            }
                        }).mouseup(function() {
                            ismove = false;
                        });
                    });
                }
            });
        },

        tianjiawangluojianting:function (callback) {
            window.addEventListener('ajaxReadyStateChange', function(e){
                // console.log("【整体】：", e.detail);
                // console.log("【请求方式】：", e.detail._byted_method);
                // console.log("【请求链接】：", e.detail.responseURL);
                // console.log("【请求主体】：", e.detail.responseText);
                // console.log("【请求数据】：", e.detail._data); // XMLHttpRequest Object
                if(e.detail.readyState == 4 && e.detail.status >= 200 && e.detail.status < 300){
                    callback(e);
                }
            });
        },

        panduanshuju:function(e){
            if(e.detail.responseURL.indexOf("/fxg.jinritemai.com/api/order/searchlist?tab=all") != -1){
                let obj = JSON.parse(e.detail.responseText).data;
                console.log("监听到的订单数据是：",obj);
                dsx.chulidingdanshuju(obj);
                dsx.xiaodianming = $(".headerShopName").text();
                dsx.jiazaishuju(dsx.xiaodianming,1,10);

            }else if(e.detail.responseURL.indexOf("/fxg.jinritemai.com/api/order/receiveinfo") != -1){
                let obj = JSON.parse(e.detail.responseText).data;
                console.log(obj);
                if(obj != null){
                    let id = e.detail.responseURL.match(/order_id=(\d*)&/)[1];
                    $.each(dsx.shuju, function(i,item){
                        if(id==item.shop_order_id){
                            dsx.shuju[i].receiver_info = obj.receive_info;
                            dsx.shuju[i].user_nickname = obj.nick_name;
                            dsx.chongxinhuizhibiaoge(dsx.shuju);
                            return;
                        };
                    });
                }
            };
            /*             else if(e.detail.responseURL.indexOf("https://mcs.snssdk.com/v1/list") != -1){//小店信息
                //console.log($.parseJSON( e.detail._data ));
                try{
                    let obj = $.parseJSON($.parseJSON(e.detail._data)[0].events[0].params);
                    if(obj.shop_name != undefined && obj.toutiao_id != undefined && obj.shop_name != ""){
                        console.log(obj.shop_name,"-",obj.toutiao_id);
                        dsx.xiaodianming = obj.shop_name;
                        dsx.xiaodianID = obj.toutiao_id;
                    };
                }catch(e){
                    console.log("获取店名失败",e);
                };

            }; */
        },


        shuju:{},

        saveshuju:function(obj){
            GM_setValue("dingdanshuju", obj);
        },

        getshuju:function(){
            dsx.shuju = GM_getValue("dingdanshuju", "没有储存数据");
            return dsx.shuju;
        },

        tiqushuju:function(obj,i) {
            let kehunicheng = obj[i].user_nickname;
            let dingdanjine = obj[i].pay_amount / 100;
            let dingdanzhuangtai = obj[i].order_status_info.order_status_text;
            let xiadanshijian = this.formatDate(obj[i].create_time);
            let dingdanbianhao = obj[i].shop_order_id;
            let lianjiebiaoti = obj[i].product_item[0].product_name;
            /*             let daihuodaren;
            let kehushoujianren;
            try{kehushoujianren = obj[i].receiver_info.post_receiver}catch(e){kehushoujianren = "没有"};
            let shoujihao = obj[i].receiver_info.post_tel;
            let dizhi = obj[i].receiver_info.post_addr.province.name + obj[i].receiver_info.post_addr.city.name + obj[i].receiver_info.post_addr.town.name + obj[i].receiver_info.post_addr.street.name;
            try{daihuodaren = obj[i].product_item[0].properties[2].text}catch(e){daihuodaren = "没有"}; */
            return {kehunicheng:kehunicheng,dingdanjine:dingdanjine,dingdanzhuangtai:dingdanzhuangtai,xiadanshijian:xiadanshijian,dingdanbianhao:dingdanbianhao,lianjiebiaoti:lianjiebiaoti};
        },

        duquhuizhidingdanshuju:function(){
            let obj = dsx.getshuju();
            if(obj != "没有储存数据"){
                dsx.shaixuanshujuhuizhibiaoge(obj);
            };
        },

        shaixuanshujuhuizhibiaoge:function(obj){
            let shuzu = [];
            let dlength = obj.length;
            for (let i = 0; i < dlength; i++) {
                let d = dsx.tiqushuju(obj,i);
                shuzu[i] = [dlength-i,d.kehunicheng,d.dingdanjine,d.dingdanzhuangtai,d.xiadanshijian,d.lianjiebiaoti,d.dingdanbianhao];
            };
            dsx.huizhibiaoge([{ title: "序号" },{ title: "昵称" },{ title: "金额" },{ title: "状态" },{ title: "下单时间" },{ title: "链接标题" },{ title: "订单编号" }],shuzu);
        },


        dashixiongtimer: 300000,

        shifouyincangbiaoge: false,

        table:{},

        huizhibiaoge : function(datehead,dataSet) {
            dsx.saveshuju(dsx.shuju);
            dsx.table = $('#dashixiongtable').DataTable({
                data: dataSet,
                columns: datehead,
                oLanguage: {
                    "sLengthMenu": "每页显示 _MENU_ 条记录",
                    "sZeroRecords": "对不起，查询不到任何相关数据",
                    "sInfo": "当前显示 _START_ 到 _END_ 条，共 _TOTAL_条记录",
                    "sInfoEmtpy": "找不到相关数据",
                    "sInfoFiltered": " 数据表中共为 _MAX_ 条记录",
                    "sProcessing": "正在加载中...",
                    "sSearch": "搜索",
                    "oPaginate": {
                        "sFirst": "第一页",
                        "sPrevious": " 上一页 ",
                        "sNext": " 下一页 ",
                        "sLast": " 最后一页 "
                    },
                },
                order:[4,"desc"],
                scrollX: true,
                scrollY: $(window).height() - 300,
                scrollCollapse: true,//滚动折叠
                paging: false,
                createdRow: function ( row, data, index ) {
                    if ( data[2] * 1 >= 396 ) {
                        $('td', row).eq(2).css('font-weight',"bold").css("color","red");
                    }
                }

            });
            $("#dashixiongtable_filter").before($('<button id="dashixiongbiaogeyincang" display="[object Object]" type="button" class="auxo-btn auxo-btn-default auxo-btn-sm index_button__fQrwe"><span>表格固定</span></button>'));
            $("#dashixiongtable_filter").before($('<label style="border: 1px solid #dcdee1; border-radius: 4px; padding: 6px 12px; height: 28px; font-size: 12px; vertical-align: middle; line-height: 14px; color: #252931;">每隔<select id="dashixiongtimer"><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>10</option><option>30</option><option>60</option><option>120</option></select>分钟刷新表格</label>'));
            console.log("表格对象",dsx.table);
        },

        chongxinhuizhibiaoge: function (obj) {
            dsx.saveshuju(dsx.shuju);
            let shuzu = [];
            let dlength = obj.length;
            for (let i = 0; i < dlength; i++) {
                let d = dsx.tiqushuju(obj,i);
                shuzu[i] = [dlength-i,d.kehunicheng,d.dingdanjine,d.dingdanzhuangtai,d.xiadanshijian,d.lianjiebiaoti,d.dingdanbianhao];
            };
            //dsx.table.data(shuzu).draw();
            dsx.table.clear().rows.add(shuzu).draw();
            /*             $(".dataTables_scrollHead").onload=function(){
                let aa = $(".dataTables_scrollBody tbody").width();
                $(".dataTables_scrollHead").css("cssText", "width:" + aa + "px !important;");
                //$(".dataTables_scrollHead").width($(".dataTables_scrollBody tbody").width());
            }; */
        },

        chulidingdanshuju : function(obj) {
            if(!($("#dashixiongtable tbody tr").length > 0)){
                //第一次运行
                dsx.shaixuanshujuhuizhibiaoge(obj);
                dsx.shuju = obj;
                dsx.saveshuju(dsx.shuju);
                //setTimeout(function(){dsx.huoqudizhi()},2000);
                //dsx.sleep(3000);
                location.reload();
            }else{
                dsx.gengxinshuju(obj);
            }
        },

        gengxinshuju : function(obj) {
            let result;
            //obj.sort((a,b) => {return b.exp_ship_time - a.exp_ship_time});
            $.each(obj, function(obji, objitem){
                result = false;
                $.each(dsx.shuju, function(i, shujuitem){
                    if (dsx.shuju[i].shop_order_id == objitem.shop_order_id) {
                        //console.log(shujuitem);
                        objitem.receiver_info = shujuitem.receiver_info;
                        objitem.user_nickname = shujuitem.user_nickname;
                        dsx.shuju[i] = objitem;
                        result = true;
                        return;
                    };
                });
                if (!result){
                    dsx.shuju.unshift(objitem);
                    //dsx.huoqudizhi(objitem.shop_order_id);//点击敏感信息
                    setTimeout(function(){dsx.huoqudizhi(objitem.shop_order_id)},obji * 2000);
                };

            });
            dsx.shuju = dsx.shuju.sort((a,b) => {return b.exp_ship_time - a.exp_ship_time});
            dsx.chongxinhuizhibiaoge(dsx.shuju);
            dsx.Toast("更新完毕");
        },

        huoqudizhi:function(id) {
            if(id){
                $(".index_content__3R2D9").each(function(){
                    if($(this).text().indexOf(id)>-1){
                        let zhudom = $(this).parent().parent().parent().parent().parent().parent();
                        let ydom = zhudom.find(".index_viewIconWrapper__1pa53").find("a").find("span");
                        if(ydom.length > 0 && zhudom.text().indexOf("已关闭") == -1){
                            ydom.click();
                        };
                        return;
                    }
                });
            }else{
                $(".index_content__3R2D9").each(function(){
                    let zhudom = $(this).parent().parent().parent().parent().parent().parent();
                    let ydom = zhudom.find(".index_viewIconWrapper__1pa53").find("a").find("span");
                    if(ydom.length > 0 && zhudom.text().indexOf("已关闭") == -1){
                        ydom.click();
                    };
                });
            }
        },

        sleep: function(time) {
            let startTime = new Date().getTime() + parseInt(time, 10);
            while(new Date().getTime() < startTime) {}
        },

        dizhixianshi:function() {
            let nicname,name,tel,dizhi;
            let id = $(this).parent().children().eq(6).text();
            $.each(dsx.shuju, function(i, item){
                if(id==item.shop_order_id){
                    nicname = item.user_nickname;
                    name = item.receiver_info.post_receiver;
                    tel = item.receiver_info.post_tel;
                    dizhi = item.receiver_info.post_addr.province.name + item.receiver_info.post_addr.city.name + item.receiver_info.post_addr.town.name + item.receiver_info.post_addr.street.name + item.receiver_info.post_addr.detail;
                };
            });
            $("#dashixiongdizhi div:nth-child(1)").html(nicname);
            $("#dashixiongdizhi div:nth-child(2)").html(name + "，" + tel + "，" + dizhi);
            let X = $(this).offset().top - $(document).scrollTop() - $("#dashixiongdizhi").outerHeight();
            let Y = $(this).parent().offset().left - $(document).scrollLeft();
            $("#dashixiongdizhi").css({"top": X , "left": Y}).show();
            $(this).parent().css("background-color", "rgba(200, 200, 200, 0.9)");
            $(this).on("mouseleave", function(e) {
                $("#dashixiongdizhi").hide();
                $(this).parent().css("background-color", "rgba(255, 255, 255, 1)");
            });
        },

        dingshiqiid:0,

        duqushezhi:function(){
            let time = GM_getValue("dashixiongtimer","无");
            if(time == "无"){
                GM_setValue("dashixiongtimer",300000);
                $('#dashixiongtimer').val(5);
            }else{
                $('#dashixiongtimer').val(time/60000);
                dsx.dashixiongtimer = time;
            }

            dsx.shifouyincangbiaoge = GM_getValue("shifouyincangbiaoge","无");
            if(dsx.shifouyincangbiaoge == "无"){
                GM_setValue("shifouyincangbiaoge",false)
                dsx.shifouyincangbiaoge = false;
            }
        },

        xiangyingshijian : function () {
            $("#dashixiongXuanFu").click(function() {
                $(".auxo-btn.auxo-btn-primary.auxo-btn-sm").click();
            });
            $("#dashixiongXuanFu").mouseenter(function() {
                $("#dashixiongDIV").stop(true, false).show();
            });
            $("#dashixiong-main").mouseleave(function() {
                if(dsx.shifouyincangbiaoge){
                    $("#dashixiongDIV").stop(true, false).hide();
                }
            });
            $("body").on("mouseenter", "#dashixiongtable>tbody tr td:nth-child(2)",dsx.dizhixianshi);

            $("#dashixiongbiaogeyincang").on("click",function(){
                if(dsx.shifouyincangbiaoge){
                    dsx.Toast("已固定表格");
                    dsx.shifouyincangbiaoge = false;
                    GM_setValue("shifouyincangbiaoge",false);
                }else{
                    dsx.Toast("鼠标离开表格自动隐藏");
                    dsx.shifouyincangbiaoge = true;
                    GM_setValue("shifouyincangbiaoge",true);
                };
            });

            $('#dashixiongtimer').change(function() {
                dsx.dashixiongtimer = $(this).val() * 60 *1000;
                GM_setValue("dashixiongtimer",$(this).val() * 60 *1000);
                window.clearInterval(dsx.dingshiqiid);
                dsx.dingshiqiid = window.setInterval(function() {
                    $(".auxo-btn.auxo-btn-primary.auxo-btn-sm").click();
                },dsx.dashixiongtimer);
            });

            dsx.dingshiqiid = window.setInterval(function() {
                $(".auxo-btn.auxo-btn-primary.auxo-btn-sm").click();
            },dsx.dashixiongtimer);
        },

        addhtml:function(){
            let a = `
<div id="dashixiong-main">
  <div id="dashixiongXuanFu"></div>
  <div id="dashixiongDIV">
    <table id="dashixiongtable"></table>
  </div>
</div>
<div id="dashixiongdizhi">
  <div></div>
  <div></div>
</div>
		`;
            $("body").eq(0).prepend(a);
        },

        addcss:function(){
            let css = `
/* 悬浮标 */
#dashixiongXuanFu {
	position: fixed;
	top: 60px;
	right: 10px;
	text-align: center;
	z-index: 9999;
	cursor: pointer;
	vertical-align: middle;
	margin-top: 4px;
	height: 34px;
	width: 34px;
	line-height: 34px;
	display: inline-block;
	border-radius: 50px;
	background-color: rgba(0, 0, 0, 0.5);
}

#dashixiongDIV {
	position: fixed;
	width: 600px;
	top: 10px;
	right: 0px;
	z-index: 9998;
	margin-top: 4px;
/* 	line-height: 34px; */
	border-radius: 15px;
    border: 1px solid #dcdee1;
	background-color: rgba(255, 255, 255, 1);
	color: #000;
	font-size: 15px;
	padding: 15px 15px;
	overflow-x: auto;
	overflow-y: auto;
}

#dashixiongtable {
	width: 100%;
	height: 100%;
	white-space: nowrap;
    -webkit-overflow-scrolling: touch;  /*移动端手指滚动更流畅*/
}

#dashixiongdizhi{
    display: none;
    pointer-events:none;
	position: fixed;
    width: 186px;
    text-align: left;
	z-index: 9999;
	border-radius: 3px;
	background-color: rgba(200, 200, 200, 0.9);
	color: #000;
    font-size: 12px;
    line-height: 16px;
	padding: 10px 10px;
}
`;
                GM_addStyle(css);
                //$("body").eq(0).prepend(a);
            },

        addscript : function(){
            let a = `
<script>
(function () {
    function ajaxEventTrigger(event) {
        var ajaxEvent = new CustomEvent(event, { detail: this });
        window.dispatchEvent(ajaxEvent);
    }
    var oldXHR = window.XMLHttpRequest;
    function newXHR() {
        var realXHR = new oldXHR();

        realXHR.addEventListener('abort', function () { ajaxEventTrigger.call(this, 'ajaxAbort'); }, false);

        realXHR.addEventListener('error', function () { ajaxEventTrigger.call(this, 'ajaxError'); }, false);

        realXHR.addEventListener('load', function () { ajaxEventTrigger.call(this, 'ajaxLoad'); }, false);

        realXHR.addEventListener('loadstart', function () { ajaxEventTrigger.call(this, 'ajaxLoadStart'); }, false);

        realXHR.addEventListener('progress', function () { ajaxEventTrigger.call(this, 'ajaxProgress'); }, false);

        realXHR.addEventListener('timeout', function () { ajaxEventTrigger.call(this, 'ajaxTimeout'); }, false);

        realXHR.addEventListener('loadend', function () { ajaxEventTrigger.call(this, 'ajaxLoadEnd'); }, false);

        realXHR.addEventListener('readystatechange', function() { ajaxEventTrigger.call(this, 'ajaxReadyStateChange'); }, false);

        return realXHR;
    };
    window.XMLHttpRequest = newXHR;
})();
</script>`;
                $("body").eq(0).prepend(a);

            }


    };
    //GM_deleteValue("dingdanshuju");
    //console.log("读取数据",dsx.getshuju());
    dsx.addhtml();
    dsx.addcss();
    dsx.addscript();
    dsx.duquhuizhidingdanshuju();
    dsx.duqushezhi();
    dsx.tianjiawangluojianting((d) => {dsx.panduanshuju(d)});
    dsx.xiangyingshijian();
    dsx.movedom("#dashixiongDIV");

    $(window).bind('beforeunload', function () {
        dsx.baocunshuju(dsx.shuju);
        return '您输入的内容尚未保存，确定离开此页面吗？';
    });

    /*
    $(document).ready(function(){
        alert("ready() 加载完成！！");
    });


        $(window).bind('beforeunload', function () {
        dsx.baocunshuju(dsx.shuju);
        return '您输入的内容尚未保存，确定离开此页面吗？';
    });

        window.onbeforeunload=function(){
        alert("网页刷新了");
        dsx.baocunshuju(dsx.shuju);
        return "你确定要离开吗？";
    };
    window.addEventListener("beforeunload", function (e) {
        var confirmationMessage = '确定离开此页吗？本页不需要刷新或后退';
        (e || window.event).returnValue = confirmationMessage;     // Gecko and Trident
        return confirmationMessage;                                // Gecko and WebKit
    });
    if (window.onurlchange === null) {
        // feature is supported
        window.addEventListener('urlchange', (info) => console.log(info));
    } */


})();