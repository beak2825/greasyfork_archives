// ==UserScript==
// @name         aliyun-domain
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  阿里云域名抢注辅助脚本
// @author       冰风
// @match        *://*.aliyun.com/*
// @require      https://cdn.bootcss.com/jquery/1.7.2/jquery.min.js
// @require      https://cdn.bootcss.com/moment.js/2.24.0/moment.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387134/aliyun-domain.user.js
// @updateURL https://update.greasyfork.org/scripts/387134/aliyun-domain.meta.js
// ==/UserScript==

/*! Tdrag 0.0.1 */
(function($,window,document,undefined){jQuery(function(){$.fn.Tdrag=function(opt){var call={scope:null,grid:null,axis:"all",pos:false,handle:null,moveClass:"tezml",dragChange:false,changeMode:"point",cbStart:function(){},cbMove:function(){},cbEnd:function(){},random:false,randomInput:null,animation_options:{duration:800,easing:"ease-out"},disable:false,disableInput:null};var dragfn=new Dragfn(this,opt);if(opt&&$.isEmptyObject(opt)==false){dragfn.options=$.extend(call,opt)}else{dragfn.options=call}dragfn.firstRandom=true;var ele=dragfn.$element;dragfn.pack(ele,false);if(dragfn.options.randomInput!=null){$(dragfn.options.randomInput).bind("click",function(){dragfn.pack(ele,true)})}dragfn.loadJqueryfn()};var Dragfn=function(ele,opt){this.$element=ele;this.options=opt};Dragfn.prototype={init:function(obj){var self=this;self.ele=self.$element;self.handle=$(obj);self.options=self.options;self.disable=self.options.disable;self._start=false;self._move=false;self._end=false;self.disX=0;self.disY=0;self.zIndex=1000;self.moving=false;self.box=$.type(self.options.scope)==="string"?self.options.scope:null;if(self.options.handle!=null){self.handle=$(obj).find(self.options.handle)}self.handle.on("mousedown",function(ev){self.start(ev,obj);obj.setCapture&&obj.setCapture();return false});if(self.options.dragChange){$(obj).on("mousemove",function(ev){self.move(ev,obj)});$(obj).on("mouseup",function(ev){self.end(ev,obj)})}else{$(document).on("mousemove",function(ev){self.move(ev,obj)});$(document).on("mouseup",function(ev){self.end(ev,obj)})}},loadJqueryfn:function(){var self=this;$.extend({sortBox:function(obj){var arr=[];for(var s=0;s<$(obj).length;s++){arr.push($(obj).eq(s))}for(var i=0;i<arr.length;i++){for(var j=i+1;j<arr.length;j++){if(Number(arr[i].attr("index"))>Number(arr[j].attr("index"))){var temp=arr[i];arr[i]=arr[j];arr[j]=temp}}}return arr},randomfn:function(obj){self.pack($(obj),true)},disable_open:function(){self.disable=false},disable_cloose:function(){self.disable=true}})},toDisable:function(){var self=this;if(self.options.disableInput!=null){$(self.options.disableInput).bind("click",function(){if(self.disable==true){self.disable=false}else{self.disable=true}})}},start:function(ev,obj){var self=this;if(self.disable==true){return false}self._start=true;var oEvent=ev||event;self.disX=oEvent.clientX-obj.offsetLeft;self.disY=oEvent.clientY-obj.offsetTop;$(obj).css("zIndex",self.zIndex++);self.options.cbStart()},move:function(ev,obj){var self=this;if(self._start!=true){return false}self._move=true;var oEvent=ev||event;var l=oEvent.clientX-self.disX;var t=oEvent.clientY-self.disY;if(self.box!=null){var rule=self.collTestBox(obj,self.box);if(l>rule.lmax){l=rule.lmax}else{if(l<rule.lmin){l=rule.lmin}}if(t>rule.tmax){t=rule.tmax}else{if(t<rule.tmin){t=rule.tmin}}}if(self.options.axis=="all"){obj.style.left=self.grid(obj,l,t).left+"px";obj.style.top=self.grid(obj,l,t).top+"px"}else{if(self.options.axis=="y"){obj.style.top=self.grid(obj,l,t).top+"px"}else{if(self.options.axis=="x"){obj.style.left=self.grid(obj,l,t).left+"px"}}}if(self.options.pos==true){self.moveAddClass(obj)}self.options.cbMove(obj,self)},end:function(ev,obj){var self=this;if(self._start!=true){return false}if(self.options.changeMode=="sort"&&self.options.pos==true){self.sortDrag(obj)}else{if(self.options.changeMode=="point"&&self.options.pos==true){self.pointDrag(obj)}}if(self.options.pos==true){self.animation(obj,self.aPos[$(obj).attr("index")])}self.options.cbEnd();if(self.options.handle!=null){$(obj).find(self.options.handle).unbind("onmousemove");$(obj).find(self.options.handle).unbind("onmouseup")}else{$(obj).unbind("onmousemove");$(obj).unbind("onmouseup")}obj.releaseCapture&&obj.releaseCapture();self._start=false},collTestBox:function(obj,obj2){var self=this;var l1=0;var t1=0;var l2=$(obj2).innerWidth()-$(obj).outerWidth();var t2=$(obj2).innerHeight()-$(obj).outerHeight();return{lmin:l1,tmin:t1,lmax:l2,tmax:t2}},grid:function(obj,l,t){var self=this;var json={left:l,top:t};if($.isArray(self.options.grid)&&self.options.grid.length==2){var gx=self.options.grid[0];var gy=self.options.grid[1];json.left=Math.floor((l+gx/2)/gx)*gx;json.top=Math.floor((t+gy/2)/gy)*gy;return json}else{if(self.options.grid==null){return json}else{console.log("grid参数传递格式错误");return false}}},findNearest:function(obj){var self=this;var iMin=new Date().getTime();var iMinIndex=-1;var ele=self.ele;for(var i=0;i<ele.length;i++){if(obj==ele[i]){continue}if(self.collTest(obj,ele[i])){var dis=self.getDis(obj,ele[i]);if(dis<iMin){iMin=dis;iMinIndex=i}}}if(iMinIndex==-1){return null}else{return ele[iMinIndex]}},getDis:function(obj,obj2){var self=this;var l1=obj.offsetLeft+obj.offsetWidth/2;var l2=obj2.offsetLeft+obj2.offsetWidth/2;var t1=obj.offsetTop+obj.offsetHeight/2;var t2=obj2.offsetTop+obj2.offsetHeight/2;var a=l2-l1;var b=t1-t2;return Math.sqrt(a*a+b*b)},collTest:function(obj,obj2){var self=this;var l1=obj.offsetLeft;var r1=obj.offsetLeft+obj.offsetWidth;var t1=obj.offsetTop;var b1=obj.offsetTop+obj.offsetHeight;var l2=obj2.offsetLeft;var r2=obj2.offsetLeft+obj2.offsetWidth;var t2=obj2.offsetTop;var b2=obj2.offsetTop+obj2.offsetHeight;if(r1<l2||r2<l1||t2>b1||b2<t1){return false}else{return true}},pack:function(ele,click){var self=this;self.toDisable();if(self.options.pos==false){for(var i=0;i<ele.length;i++){$(ele[i]).css("position","absolute");$(ele[i]).css("margin","0");self.init(ele[i])}}else{if(self.options.pos==true){var arr=[];if(self.options.random||click){while(arr.length<ele.length){var n=self.rnd(0,ele.length);if(!self.finInArr(arr,n)){arr.push(n)}}}if(self.options.random==false||click!=true){var n=0;while(arr.length<ele.length){arr.push(n);n++}}if(self.firstRandom==false){var sortarr=[];var n=0;while(sortarr.length<ele.length){sortarr.push(n);n++}for(var i=0;i<ele.length;i++){$(ele[i]).attr("index",sortarr[i]);$(ele[i]).css("left",self.aPos[sortarr[i]].left);$(ele[i]).css("top",self.aPos[sortarr[i]].top)}}self.aPos=[];if(self.firstRandom==false){for(var j=0;j<ele.length;j++){self.aPos[j]={left:ele[$(ele).eq(j).attr("index")].offsetLeft,top:ele[$(ele).eq(j).attr("index")].offsetTop}}}else{for(var j=0;j<ele.length;j++){self.aPos[j]={left:ele[j].offsetLeft,top:ele[j].offsetTop}}}for(var i=0;i<ele.length;i++){$(ele[i]).attr("index",arr[i]);$(ele[i]).css("left",self.aPos[arr[i]].left);$(ele[i]).css("top",self.aPos[arr[i]].top);$(ele[i]).css("position","absolute");$(ele[i]).css("margin","0");self.init(ele[i])}self.firstRandom=false}}},moveAddClass:function(obj){var self=this;var oNear=self.findNearest(obj);$(self.$element).removeClass(self.options.moveClass);if(oNear&&$(oNear).hasClass(self.options.moveClass)==false){$(oNear).addClass(self.options.moveClass)}},sort:function(){var self=this;var arr_li=[];for(var s=0;s<self.$element.length;s++){arr_li.push(self.$element[s])}for(var i=0;i<arr_li.length;i++){for(var j=i+1;j<arr_li.length;j++){if(Number($(arr_li[i]).attr("index"))>Number($(arr_li[j]).attr("index"))){var temp=arr_li[i];arr_li[i]=arr_li[j];arr_li[j]=temp}}}return arr_li},pointDrag:function(obj){var self=this;var oNear=self.findNearest(obj);if(oNear){self.animation(obj,self.aPos[$(oNear).attr("index")]);self.animation(oNear,self.aPos[$(obj).attr("index")]);var tmp;tmp=$(obj).attr("index");$(obj).attr("index",$(oNear).attr("index"));$(oNear).attr("index",tmp);$(oNear).removeClass(self.options.moveClass)}else{if(self.options.changeWhen=="end"){self.animation(obj,self.aPos[$(obj).attr("index")])}}},sortDrag:function(obj){var self=this;var arr_li=self.sort();var oNear=self.findNearest(obj);if(oNear){if(Number($(oNear).attr("index"))>Number($(obj).attr("index"))){var obj_tmp=Number($(obj).attr("index"));$(obj).attr("index",Number($(oNear).attr("index"))+1);for(var i=obj_tmp;i<Number($(oNear).attr("index"))+1;i++){self.animation(arr_li[i],self.aPos[i-1]);self.animation(obj,self.aPos[$(oNear).attr("index")]);$(arr_li[i]).removeClass(self.options.moveClass);$(arr_li[i]).attr("index",Number($(arr_li[i]).attr("index"))-1)}}else{if(Number($(obj).attr("index"))>Number($(oNear).attr("index"))){var obj_tmp=Number($(obj).attr("index"));$(obj).attr("index",$(oNear).attr("index"));for(var i=Number($(oNear).attr("index"));i<obj_tmp;i++){self.animation(arr_li[i],self.aPos[i+1]);self.animation(obj,self.aPos[Number($(obj).attr("index"))]);$(arr_li[i]).removeClass(self.options.moveClass);$(arr_li[i]).attr("index",Number($(arr_li[i]).attr("index"))+1)}}}}else{self.animation(obj,self.aPos[$(obj).attr("index")])}},animation:function(obj,json){var self=this;var options=self.options.animation_options;var self=this;var count=Math.round(options.duration/30);var start={};var dis={};for(var name in json){start[name]=parseFloat(self.getStyle(obj,name));if(isNaN(start[name])){switch(name){case"left":start[name]=obj.offsetLeft;break;case"top":start[name]=obj.offsetTop;break;case"width":start[name]=obj.offsetWidth;break;case"height":start[name]=obj.offsetHeight;break;case"marginLeft":start[name]=obj.offsetLeft;break;case"borderWidth":start[name]=0;break}}dis[name]=json[name]-start[name]}var n=0;clearInterval(obj.timer);obj.timer=setInterval(function(){n++;for(var name in json){switch(options.easing){case"linear":var a=n/count;var cur=start[name]+dis[name]*a;break;case"ease-in":var a=n/count;var cur=start[name]+dis[name]*a*a*a;break;case"ease-out":var a=1-n/count;var cur=start[name]+dis[name]*(1-a*a*a);break}if(name=="opacity"){obj.style.opacity=cur;obj.style.filter="alpha(opacity:"+cur*100+")"}else{obj.style[name]=cur+"px"}}if(n==count){clearInterval(obj.timer);options.complete&&options.complete()}},30)},getStyle:function(obj,name){return(obj.currentStyle||getComputedStyle(obj,false))[name]},rnd:function(n,m){return parseInt(Math.random()*(m-n)+n)},finInArr:function(arr,n){for(var i=0;i<arr.length;i++){if(arr[i]==n){return true}}return false}}})})(jQuery,window,document);

(function() {
    // 'use strict';
    var $ = $ || window.$;

    /**数组根据数组对象中的某个属性值进行排序的方法
     * 使用例子：newArray.sort(sortBy('number',false)) //表示根据number属性降序排列;若第二个参数不传递，默认表示升序排序
     * @param attr 排序的属性 如number属性
     * @param rev true表示升序排列，false降序排序
     * */
    function sortBy(attr,rev){
        //第二个参数没有传递 默认升序排列
        if(rev ==  undefined){
            rev = 1;
        }else{
            rev = (rev) ? 1 : -1;
        }

        return function(a,b){
            a = a[attr];
            b = b[attr];
            if(a < b){
                return rev * -1;
            }
            if(a > b){
                return rev * 1;
            }
            return 0;
        }
    }

    var currUrl = window.location.href;

    moment.locale('zh-cn',{
        relativeTime : {
            future: "%s",
            past:   "%s以前",
            s:  "秒",
            m:  "1分钟",
            mm: "%d分钟",
            h:  "1小时",
            hh: "%d小时",
            d:  "1天",
            dd: "%d天",
            M:  "1个月",
            MM: "%d个月",
            y:  "1年",
            yy: "%d年"
        }
    });
    /*moment.relativeTimeThreshold('s', 60);
    moment.relativeTimeThreshold('m', 60);
    moment.relativeTimeThreshold('h', 24);
    moment.relativeTimeThreshold('d', 30);
    moment.relativeTimeThreshold('M', 12);*/

    var remind_level1_time = 1 * 60 * 60;
    var remind_level1_color = "red";
    var remind_level2_time = 2 * 60 * 60;
    var remind_level2_color = "#f90";

    // 域名查询
    if(currUrl.indexOf("wanwang.aliyun.com/domain/searchresult") != -1 ) {
        console.log("域名查询");
        /*checkdomain("asdkawiqewe.com");

        function checkdomain(domain, callback) {
            $.ajax({
                url: "https://checkapi.aliyun.com/check/checkdomain?domain="+domain+"&token=Yeb1332467f6cdc4132eaa437a5a7076b",
                type: "GET",
                dataType: "jsonp", //指定服务器返回的数据类型
                success: function (d) {
                    console.log(d);
                }
            });
        }*/
    }
    // 域名标记
    else if(currUrl.indexOf("wanwang.aliyun.com/domain/reserve") != -1 ) {
        console.log("域名标记");

        var table_loading_seconds = 2;
        var table_timer = setInterval(function() {
            if(table_loading_seconds == 0) {
                showbutton();
            }
            table_loading_seconds--;
        }, 1000);
        $("div.table table.aps-table tbody").bind("DOMNodeInserted",function(e) {
            $(".domain-mark").remove();
            table_loading_seconds = 2;
        }).bind("DOMNodeRemoved",function(e) {
            $(".domain-mark").remove();
            table_loading_seconds = 2;
        })

        // 显示标记按钮
        function showbutton() {
            if($("div.table table.aps-table tbody tr td[data-field='domainName']").length == 0) return;

            // 读取标记的域名
            var markdomains = getmarkdomains();

            // 显示标记按钮
            $("div.table table.aps-table tbody tr").each(function (index, item) {
                // 获取域名信息
                var td_domainName = $(item).find("td[data-field='domainName']");
                var domain = td_domainName.find("a:first div").text();

                // 克隆标记按钮
                var td_button = $(item).find("td:last").children();

                var btn = td_button.clone();
                btn.addClass("domain-mark").css({"position": "absolute", "z-index": 9999}).data("domain", domain).text("打标记");

                if(td_button.prop("disabled")){
                    btn.css({"color": "green", "font-weight": "bold","border": "1px solid green"}).text("已预订");
                    removedomain(domain);
                } else {
                    // 判断是否已存在标记
                    $.each(markdomains, function(markdomain_i, markdomain) {
                        if(domain == markdomain.domainName) {
                            // 存在标记
                            btn.prop("disabled", true).text("已标记");
                            return false;
                        }
                    })
                }

                btn.unbind();// 移除克隆按钮绑定过的所有事件；
                //td_domainName.prepend(btn);
                $("body").append(btn);
            })

            $(".domain-mark").click(function () {
                var domain = $(this).data("domain");
                querydomain(domain.split(".")[0], 20, function(datas){
                    var info;
                    $.each(datas, function(i, item) {
                        if(domain == item.domainName) {
                            // 获取域名信息
                            info = item;
                            return false;
                        }
                    })
                    if(!info){
                        alert("未能查询到域名("+domain+")的信息，请重新尝试");
                        return;
                    }
                    // 标记域名
                    markdomain(info);
                    loadmarkdomains();
                });
                $(this).prop("disabled", true).text("已标记");
            })

            // 调整位置
            buttonAutoPosition();
        }

        function buttonAutoPosition(){
            $(".domain-mark").each(function(i, item){
                var div_domainName = $("td[data-field='domainName']").eq(i).find("a:first div");
                var top = div_domainName.offset().top;
                var left = div_domainName.offset().left - 95;
                $(item).css({"top": top, "left": left});
            })
        }

        function querydomain(keyWord, pageSize, callback){
            $.ajax({
                url: "https://domainapi.aliyun.com/partnerReserve/search.jsonp?keyWord="+keyWord+"&pageSize="+pageSize+"&token=tdomain-aliyun-com%3AY053155c3ebbe8874a71f294565baa9df",
                type: "GET",
                dataType: "jsonp", //指定服务器返回的数据类型
                success: function (d) {
                    if(d.code != 200){
                        alert("域名信息错误查询，请重新尝试");
                        return;
                    }
                    callback(d.data.pageResult.data);
                }
            });
        }

        function markdomain(info){
            var markdomains = getmarkdomains();
            markdomains.push(info);
            localStorage.setItem("markdomains", JSON.stringify(markdomains));
        }

        var box_top = localStorage.getItem("box_top");
        var box_right = localStorage.getItem("box_right");
        if(!box_top) box_top = 70;
        if(!box_right) box_right = 30;

        function showbox()
        {
            // 初始化box
            var html = "<div id='div_box' class='aps-widget' style='width:400px;position:fixed;top:"+box_top+"px;right:"+box_right+"px;z-index:9999;background:#fff;border:1px solid #ccc;padding: 5px;padding-top: 0;opacity: 0.9;box-shadow: 0px 0px 10px #000;'>";
            html += "<p style='margin: 0;margin-bottom: 2px;border-bottom: 1px solid #ccc;padding:5px 0 5px; cursor: move;'>";
            html += "<span style='width:118px;display: inline-block;'>标记域名(<span id='sp_total'>0</span>)</span>";
            html += " | ";
            html += "<span style='width:60px;display: inline-block; text-align: center;'>剩余时间</span>";
            html += " | ";
            html += "<span style='width:60px;display: inline-block; text-align: center;'>预订人数</span>";
            html += " | ";
            html += "<a href='javascript:' id='a_refresh' style='float:right;'>全部刷新</a>";
            html += "</p>";
            html += "<ul style='list-style-type: none;padding: 0;margin: 0;max-height: 488px;display: inline-block;overflow-y: auto;width: 100%;'>";
            html += "</ul>";
            html += "</div>";
            $("body").append(html);
        }

        function getmarkdomains() {
            var markdomains = [];
            var markstr = localStorage.getItem("markdomains");
            if(markstr && markstr != "undefined") markdomains = JSON.parse(markstr);
            return markdomains;
        }

        // 加载数据
        function loadmarkdomains() {
            var markdomains = getmarkdomains();
            markdomains = markdomains.sort(sortBy('bookEndTime'));

            var html = "";
            $.each(markdomains, function(markdomain_i, markdomain) {
                html += "<li style='line-height:1.6em;'>";
                html += "<a style='width:118px; display: inline-block;' href='https://wanwang.aliyun.com/domain/reserve?#/detail/"+ markdomain.domainName +"'>" + markdomain.domainName + "</a>";
                html += " | ";
                html += "<span style='width:60px;display: inline-block; text-align: right;' class='sp_rest_time' data-domain='" + markdomain.domainName + "'>-</span>";
                html += " | ";
                html += "<span style='width:60px;display: inline-block; text-align: right;'><span class='sp_bookednum' data-domain='" + markdomain.domainName + "'>" + markdomain.bookedNum + "</span> 人</span>";
                html += " | ";
                html += "<span style='float:right;margin-right: 15px;'>";
                html += "<a class='a_refresh' style='width:2em;display: inline-block;' href='javascript:' data-domain='" + markdomain.domainName + "'>刷新</a>";
                html += " | ";
                html += "<a class='a_removedomain' style='width:2em;display: inline-block;' href='javascript:' data-domain='" + markdomain.domainName + "'>取消</a>";
                html += "</span>";
                html += "</li>";
            })
            $("#sp_total").text(markdomains.length);
            $("#div_box ul").html(html);
            $("#div_box li:odd").css("background-color","#f3f3f3");
            $("#div_box a").hover(function(){
                $(this).css("text-decoration","underline");
            },function(){
                $(this).css("text-decoration","none");
            });

            $(".a_removedomain").click(function(){

                removedomain($(this).data("domain"));

                $(".domain-mark").remove();
                showbutton();
            })
            bookmonitor(markdomains);
        }

        function removedomain(domain){
            var markdomains = getmarkdomains();
            markdomains = removeitem(markdomains, domain);
            if(typeof(markdomains) != "undefined"){
                localStorage.setItem("markdomains", JSON.stringify(markdomains));
                loadmarkdomains();
            }
        }

        function removeitem(_arr, domain) {
            var length = _arr.length;
            for (var i = 0; i < length; i++) {
                if (_arr[i].domainName == domain) {
                    if (i == 0) {
                        _arr.shift(); //删除并返回数组的第一个元素
                        return _arr;
                    }
                    else if (i == length - 1) {
                        _arr.pop();  //删除并返回数组的最后一个元素
                        return _arr;
                    }
                    else {
                        _arr.splice(i, 1); //删除下标为i的元素
                        return _arr;
                    }
                }
            }
        }

        // 监控
        var booktimer;
        function bookmonitor(markdomains) {
            if(booktimer){
                clearInterval(booktimer);
            }
            booktimer = setInterval(function() {
                $("#div_box").css("position","fixed");
                $.each(markdomains, function(i, domain) {
                    // 剩余时间
                    var restTime = moment(domain.bookEndTime).diff(moment(), 'seconds');
                    var timeSpan = $("span.sp_rest_time[data-domain='" + domain.domainName + "']");
                    timeSpan.text(moment().to(moment(domain.bookEndTime)));
                    if(restTime <= remind_level1_time) {
                        timeSpan.css("color", remind_level1_color);
                    } else if (restTime <= remind_level2_time){
                        timeSpan.css("color", remind_level2_color);
                    } else {
                        timeSpan.css("color","#373d41");
                    }
                })
            }, 1000);
        }

        $(window).resize(function(){
            setTimeout(buttonAutoPosition, 200);
        });


        $(function(){
            showbox();
            loadmarkdomains();
            
            $("#div_box").Tdrag({
                handle: "p",
                cbEnd: function() {
                    var div = $("#div_box");
                    var offset = $("#div_box").offset();
                    box_top = offset.top - $(document).scrollTop();
                    box_right = $(document).width() - (div.width() + 12) - offset.left;
                    div.css("left", "").css("top", box_top).css("right", box_right);
                    localStorage.setItem("box_top", box_top);
                    localStorage.setItem("box_right", box_right);
                }
            });

            // 手动刷新全部域名
            $("body").on("click", "#a_refresh", function() {
                var markdomains = getmarkdomains();

                var keyWords = [];
                $.each(markdomains, function(i, item) {
                    keyWords.push(item.domainName.split(".")[0]);
                })

                querydomain(keyWords.join(","), 50, function(datas){
                    $.each(markdomains, function(markdomain_i, markdomain) {
                        $.each(datas, function(item_i, item) {
                            if(markdomain.domainName == item.domainName) {
                                // 更新域名信息
                                markdomains[markdomain_i] = item;
                                return false;
                            }
                        })
                    })
                    localStorage.setItem("markdomains", JSON.stringify(markdomains));
                    loadmarkdomains();
                });
            });
            // 刷新单个域名信息
            $("body").on("click", ".a_refresh", function() {
                var markdomains = getmarkdomains();
                var domain = $(this).data("domain");
                // 先判断是否标记过
                var markdomain_i = -1;
                $.each(markdomains, function(i, item) {
                    if(item.domainName == domain){
                        markdomain_i = i;
                        return false;
                    }
                })
                if(markdomain_i == -1) {
                    alert("标记域名中已不存在"+domain+"，请检查");
                    return;
                }

                var sp_bookednum = $(".sp_bookednum[data-domain='"+domain+"']");
                sp_bookednum.text("-");

                querydomain(domain.split(".")[0], 10, function(datas){
                    $.each(datas, function(item_i, item) {
                        if(domain == item.domainName) {
                            // 更新域名信息
                            markdomains[markdomain_i] = item;
                            sp_bookednum.text(item.bookedNum);
                            return false;
                        }
                    })
                    localStorage.setItem("markdomains", JSON.stringify(markdomains));
                });
            });
        })

    }
    // 竞价进行中
    else if(currUrl.indexOf("domain.console.aliyun.com") != -1 ) {
        // 倒计时提醒设置（单位：秒）
        var domains = [];

        var div_top = localStorage.getItem("div_top");
        var div_right = localStorage.getItem("div_right");
        if(!div_top) div_top = 70;
        if(!div_right) div_right = 30;

        // 初始化
        function init()
        {
            // 初始化box
            var html = "<div id='div_box' style='font-size:14px;width:400px;position:fixed;top:" + div_top + "px;right:" + div_right + "px;z-index:9999;background:#fff;border:1px solid #ccc;padding:0 5px 0;opacity: 0.9;box-shadow: 0px 0px 10px #000;'>";
            html += "<p style='margin: 0;margin-bottom: 2px;border-bottom: 1px solid #ccc;padding:5px 0 5px; cursor: move;'>";
            html += "<span style='width:130px;display: inline-block;'>进行中(<span id='sp_total'>0</span>)</span>";
            html += " | ";
            html += "<span style='width:70px;display: inline-block;'>当前价格</span>";
            html += " | ";
            html += "<span style='width:70px;display: inline-block;'>我的出价</span>";
            html += " | ";
            html += "<a href='javascript:' id='a_refresh' style='float:right;'>刷新</a>";
            html += "</p>";
            html += "<ul style='list-style-type: none;padding: 0;margin: 0;max-height: 484px;overflow-y: auto;width: 100%;'>";
            html += "</ul>";
            html += "</div>";
            $("body").append(html);

            loadata();
            autorefresh();
        }

        // 加载数据
        function loadata()
        {
            var timestamp = (new Date()).getTime();
            var request_url = "https://domain.console.aliyun.com/solddomain/partnerAuctionApi/partnerAuctionList.json?__preventCache=" + timestamp + "&auctionEndTimeOrder=ASC&currentPage=1&domainName=&pageSize=200&status=2%7C3";
            $.get(request_url, function(d){
                if (d.code != 200) {
                    alert("信息获取失败，请重新刷新页面");
                    return;
                }
                var total = d.data.totalItemNum;
                if (total <= 0) {
                    return;
                }
                domains = d.data.data;
                showdata();
                monitor();
            });
        }

        // 监控
        var timer;
        function monitor() {
            if(timer){
                clearInterval(timer);
            }
            timer = setInterval(function() {
                $.each(domains, function(i, domain) {
                    // 竞拍剩余时间
                    var restTime = moment(domain.auctionEndTime).diff(moment(), 'seconds');
                    var timeSpan = $("span.sp_rest_time[data-domain='" + domain.domainName + "']");
                    timeSpan.text(moment().to(moment(domain.auctionEndTime)));
                    if(restTime <= remind_level1_time) {
                        timeSpan.css("color", remind_level1_color);
                    } else if (restTime <= remind_level2_time){
                        timeSpan.css("color", remind_level2_color);
                    } else {
                        timeSpan.css("color","#999");
                    }
                })
            }, 1000);
        }

        // 显示数据
        function showdata()
        {
            var html = "";
            var price_color = "#999";
            $.each(domains, function(i, domain) {
                html += "<li style='line-height:1.6em;'>";
                html += "<a style='width:130px;display: inline-block;' href='https://domain.console.aliyun.com/#/buyer/partnerAuctionBidRecord/"+ domain.partnerDomainId +"'>" + domain.domainName + "</a>";
                html += " | ";
                price_color = "#999";
                if (domain.leadPriceRmb > domain.priceRmb) price_color = "red";
                html += "<span style='width:70px;  display: inline-block; color:" + price_color + ";'>￥" + domain.leadPriceRmb + "</span>";
                html += " | ";
                price_color = "#999";
                if (domain.leadPriceRmb <= domain.priceRmb) price_color = "green";
                html += "<span style='width:70px;display: inline-block; color:" + price_color + ";'>￥" + domain.priceRmb + "</span>";
                html += " | ";
                html += "<span style='float:right;'><span style='float:right;' class='sp_rest_time' data-domain='" + domain.domainName + "'>-</span></span>";
                html += "</li>";
            });
            $("#sp_total").text(domains.length);
            $("#div_box ul").html(html);
            $("#div_box li:odd").css("background-color","#f3f3f3");
        }

        // 手动刷新
        $("body").on("click", "#a_refresh", function() {
            loadata();
        });

        // 自动刷新（间隔1分钟，第一次执行时间是1分钟之后）
        var refreshSeconds = 60;
        function autorefresh()
        {
            var a_refresh = $("#a_refresh");
            a_refresh.data("text",a_refresh.text());
            setInterval(function(){
                a_refresh.text(a_refresh.data("text")+"("+refreshSeconds+")");
                if(refreshSeconds == 0){
                    refreshSeconds = 60;
                    loadata();
                }
                else refreshSeconds--;
            }, 1000);
        }

        init();

        $(function(){
            $("#div_box").Tdrag({
                handle: "p",
                cbEnd: function() {
                    var div = $("#div_box");
                    var offset = $("#div_box").offset();
                    div_top = offset.top;
                    div_right = $(document).width() - (div.width() + 12) - offset.left;
                    div.css("left", "").css("top", div_top).css("right", div_right);
                    localStorage.setItem("div_top", div_top);
                    localStorage.setItem("div_right", div_right);
                }
            });
        })
    }

})();